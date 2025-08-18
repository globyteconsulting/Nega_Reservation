from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'secret'  # needed for flash messages

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.form.get('email_address')
    notify = request.form.get('notify')

    if not email:
        flash('Email address is required.')
        return redirect(url_for('home'))

    # For now, just print or log the result
    print(f"New subscription: {email} — Notify via: {notify}")

    flash('Thanks for subscribing!')
    return redirect(url_for('home'))
