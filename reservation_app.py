# app.py
import os
import json
from flask import Flask, render_template, request, redirect, url_for, flash, session

# Initialize the Flask application
app = Flask(__name__)

# --- Configuration ---
# Define the paths for the JSON data files
PRODUCTS_FILE = 'products.json'
SUBSCRIPTIONS_FILE = 'subscriptions.json'

# Set a secret key for Flask's session management.
# IMPORTANT: In a production environment, use a much stronger, randomly generated key
# and store it securely (e.g., as an environment variable).
app.secret_key = 'a_very_secret_and_random_key_that_you_should_change'

# Hardcoded admin credentials for demonstration purposes.
# !!! DO NOT USE IN PRODUCTION !!!
# In a real application, you would use hashed passwords and a proper user management system.
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'password123')

# Global variables to hold our application data (products and subscriptions)
# These will be loaded from their respective files at startup.
app_data = {
    "products": [],
    "subscriptions": []
}

# --- Utility Functions for JSON Data ---
def load_products_data():
    """
    Loads products data from the JSON file.
    Initializes with an empty list if the file doesn't exist or is invalid.
    """
    if not os.path.exists(PRODUCTS_FILE):
        return []
    try:
        with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading products data from {PRODUCTS_FILE}: {e}. Initializing empty data.")
        return []

def save_products_data(products):
    """
    Saves products data to the JSON file.
    """
    try:
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=4) # Use indent for pretty printing
    except IOError as e:
        print(f"Error saving products data to {PRODUCTS_FILE}: {e}")

def load_subscriptions_data():
    """
    Loads subscriptions data from the JSON file.
    Initializes with an empty list if the file doesn't exist or is invalid.
    """
    if not os.path.exists(SUBSCRIPTIONS_FILE):
        return []
    try:
        with open(SUBSCRIPTIONS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Error loading subscriptions data from {SUBSCRIPTIONS_FILE}: {e}. Initializing empty data.")
        return []

def save_subscriptions_data(subscriptions):
    """
    Saves subscriptions data to the JSON file.
    """
    try:
        with open(SUBSCRIPTIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump(subscriptions, f, indent=4) # Use indent for pretty printing
    except IOError as e:
        print(f"Error saving subscriptions data to {SUBSCRIPTIONS_FILE}: {e}")

def get_next_id(items):
    """
    Generates a new unique ID for a list of items (products or subscriptions).
    """
    return max([item['id'] for item in items]) + 1 if items else 1

# --- Utility for Notification Simulation ---
def send_notification(email, phone, product_name, notification_type):
    """
    Simulates sending a notification to a customer based on their preferred type.
    """
    if notification_type in ['email', 'both'] and email:
        print(f"\n--- SIMULATED EMAIL NOTIFICATION ---")
        print(f"To: {email}")
        print(f"Subject: Your Reserved Product is Now Available!")
        print(f"Body: Great news! The product '{product_name}' you were waiting for is now available.")
        print(f"-------------------------------------\n")

    if notification_type in ['phone', 'both'] and phone:
        print(f"\n--- SIMULATED PHONE (SMS/Call) NOTIFICATION ---")
        print(f"To: {phone}")
        print(f"Message: Your reserved product '{product_name}' is now available!")
        print(f"-------------------------------------\n")

# --- Routes ---

@app.route('/', methods=['GET', 'POST'])
def index():
    """
    Handles the homepage, displaying the subscription form and processing submissions.
    """
    products = app_data.get('products', [])

    if request.method == 'POST':
        email = request.form.get('email')
        phone = request.form.get('phone')
        product_id = int(request.form.get('product_id'))
        notification_type = request.form.get('notification_type')

        # Basic validation based on notification type
        if notification_type == 'email' and not email:
            flash('Please provide your email address.', 'error')
            return redirect(url_for('index'))
        elif notification_type == 'phone' and not phone:
            flash('Please provide your phone number.', 'error')
            return redirect(url_for('index'))
        elif notification_type == 'both' and (not email or not phone):
            flash('Please provide both your email and phone number.', 'error')
            return redirect(url_for('index'))
        
        if not product_id or not notification_type:
             flash('Please select a product and choose a notification type.', 'error')
             return redirect(url_for('index'))

        # Check if the selected product exists
        product_exists = any(p['id'] == product_id for p in products)
        if not product_exists:
            flash('The selected product does not exist.', 'error')
            return redirect(url_for('index'))

        # Check if the user has already subscribed to this specific product
        # For simplicity, uniqueness is still based on email + product_id
        # Consider a more robust uniqueness check for phone numbers too if email is optional.
        existing_subscription = next((s for s in app_data['subscriptions']
                                      if s.get('email') == email and s['product_id'] == product_id), None)
        if existing_subscription:
            flash(f'You are already subscribed for notifications about '
                  f'{next((p["name"] for p in products if p["id"] == product_id), "this product")}.', 'info')
            return redirect(url_for('index'))

        # Create a new subscription record
        new_subscription_id = get_next_id(app_data['subscriptions'])
        new_subscription = {
            "id": new_subscription_id,
            "email": email,
            "phone": phone,
            "product_id": product_id,
            "notified": False,
            "notification_type": notification_type
        }
        app_data['subscriptions'].append(new_subscription)
        save_subscriptions_data(app_data['subscriptions']) # Save only subscriptions

        product_name = next((p['name'] for p in products if p['id'] == product_id), 'the product')
        flash(f'Successfully subscribed to notifications for "{product_name}"! We will notify you by {notification_type}.', 'success')
        return redirect(url_for('index'))

    return render_template('index.html', products=products)

@app.route('/admin_login', methods=['GET', 'POST'])
def admin_login():
    """
    Handles admin login.
    """
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            flash('Logged in successfully as admin!', 'success')
            return redirect(url_for('admin_panel'))
        else:
            flash('Invalid credentials. Please try again.', 'error')
    return render_template('admin_login.html')

@app.route('/admin')
def admin_panel():
    """
    Displays a simple admin panel for managing products and subscriptions.
    Requires admin login.
    """
    if not session.get('logged_in'):
        flash('Please log in to access the admin panel.', 'info')
        return redirect(url_for('admin_login'))

    products = app_data.get('products', [])
    subscriptions = app_data.get('subscriptions', [])

    # Prepare subscriptions for display by adding product names
    display_subscriptions = []
    product_map = {p['id']: p['name'] for p in products}
    for sub in subscriptions:
        sub_with_name = sub.copy()
        sub_with_name['product_name'] = product_map.get(sub['product_id'], 'Unknown Product')
        display_subscriptions.append(sub_with_name)

    return render_template('admin.html', products=products, subscriptions=display_subscriptions)

@app.route('/admin_logout')
def admin_logout():
    """
    Logs out the admin user.
    """
    session.pop('logged_in', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('index'))


@app.route('/toggle-availability/<int:product_id>')
def toggle_availability(product_id):
    """
    Toggles the availability status of a product.
    If a product becomes available, it triggers notifications for relevant subscribers.
    Requires admin login.
    """
    if not session.get('logged_in'):
        flash('Please log in to perform this action.', 'info')
        return redirect(url_for('admin_login'))

    product = next((p for p in app_data['products'] if p['id'] == product_id), None)
    if not product:
        flash('Product not found.', 'error')
        return redirect(url_for('admin_panel'))

    old_status = product['is_available']
    product['is_available'] = not product['is_available']
    save_products_data(app_data['products']) # Save only products

    if product['is_available'] and not old_status:
        # Product became available, notify relevant subscribers
        subscribers_notified_count = 0
        for sub in app_data['subscriptions']:
            if sub['product_id'] == product_id and not sub['notified']:
                send_notification(sub.get('email'), sub.get('phone'), product['name'], sub['notification_type'])
                sub['notified'] = True
                subscribers_notified_count += 1
        save_subscriptions_data(app_data['subscriptions']) # Save updated subscription statuses
        flash(f'Product "{product["name"]}" is now AVAILABLE. {subscribers_notified_count} subscriber(s) notified.', 'success')
    elif not product['is_available'] and old_status:
        # Product became unavailable, optionally reset notification status
        for sub in app_data['subscriptions']:
            if sub['product_id'] == product_id:
                sub['notified'] = False
        save_subscriptions_data(app_data['subscriptions']) # Save updated subscription statuses
        flash(f'Product "{product["name"]}" is now UNAVAILABLE. All related notification statuses reset.', 'warning')
    else:
        flash(f'Product "{product["name"]}" availability toggled.', 'info')

    return redirect(url_for('admin_panel'))

@app.route('/delete-subscription/<int:sub_id>')
def delete_subscription(sub_id):
    """
    Deletes a specific subscription from the data.
    Requires admin login.
    """
    if not session.get('logged_in'):
        flash('Please log in to perform this action.', 'info')
        return redirect(url_for('admin_login'))

    original_len = len(app_data['subscriptions'])
    app_data['subscriptions'] = [s for s in app_data['subscriptions'] if s['id'] != sub_id]

    if len(app_data['subscriptions']) < original_len:
        save_subscriptions_data(app_data['subscriptions']) # Save only subscriptions
        flash('Subscription deleted successfully.', 'success')
    else:
        flash('Subscription not found.', 'error')
    return redirect(url_for('admin_panel'))

# --- Main Application Run Block ---
if __name__ == '__main__':
    os.makedirs('templates', exist_ok=True)

    # Load initial data for both products and subscriptions
    app_data['products'] = load_products_data()
    app_data['subscriptions'] = load_subscriptions_data()

    if not app_data['products']:
        print("Initializing default products...")
        initial_products = [
            {"id": 1, "name": "Limited Edition Sneaker", "is_available": False},
            {"id": 2, "name": "Exclusive Art Print", "is_available": False},
            {"id": 3, "name": "Concert Ticket Batch 1", "is_available": False},
            {"id": 4, "name": "Pre-order Gadget X", "is_available": False}
        ]
        app_data['products'].extend(initial_products)
        save_products_data(app_data['products']) # Save initial products
        print("Default products added.")

    app.run(debug=True)
