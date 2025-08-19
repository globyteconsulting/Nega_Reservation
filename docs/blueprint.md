# **App Name**: Prime Cuts Online

## Core Features:

- Product Display: Display available meat products with images and 'out of stock' indicator.
- Reservation Form: Allow customers to submit reservations with their name, contact information, and order details (category and quantity).
- Stock Management: Enable administrators to toggle the stock status of meat products.
- Order List: Display current reservations with customer and order information to the admin.
- Order Processing: Allow admins to mark reservations as 'accepted'.
- Authentication: Generate temporary sign-in tokens for user authentication to be stored in Firebase.
- SMS Reminder: Periodically send a text message reminder to customers whose orders have the 'pending' status; the LLM will act as a tool to assess whether each customer qualifies to be sent the message (such as the message not having been already sent.)

## Style Guidelines:

- Primary color: Deep violet (#624CAB) to convey a sense of richness and quality.
- Background color: Light violet (#F2F0F9), offering a soft contrast to the primary color without being stark white.
- Accent color: Deep rose (#BB6BD9) to draw attention to interactive elements such as buttons and selected items.
- Body and headline font: 'Inter', sans-serif. Easy to read and suitable for displaying order and product information.
- Use simple and clear icons to represent different types of meat products (beef, pork, lamb).
- Use a grid layout for the customer view to showcase meat products. Implement distinct sections for reservations and subscriptions.
- Provide smooth transitions on hover interactions, and subtle loading animations to enhance user experience without being intrusive.