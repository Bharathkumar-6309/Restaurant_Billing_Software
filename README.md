# Restaurant_Billing_Software
Restaurant_Billing_Software
🍽 Restaurant Billing System – Full Stack (Frontend + Backend)
📌 Project Overview
This project is a full-stack restaurant billing application built using HTML, CSS, JavaScript for the frontend and Python Flask for the backend.
It enables restaurant staff to:

Select food items from a menu.

Manage orders for Dine-In or Takeaway.

Choose payment methods like Cash, Card, or UPI.

Automatically calculate the total bill.

Process the payment and display a Thank You message.

🖥 Frontend (HTML + CSS + JavaScript)
The frontend provides an interactive and responsive user interface:

Menu Section: Displays all available food items with “Add to Cart” buttons.

Cart & Order Summary: Shows the list of selected items, quantities, and running total.

Billing Section:

Select Order Type (Dine-In / Takeaway).

Optional Customer Name and Table Number fields.

Choose Payment Method (Cash, Card, UPI) with highlighted selection.

Display the Total Amount in real-time.

Process Payment Button: Triggers the backend payment API call.

Responsive Design: CSS Flex/Grid for mobile-friendly layout.

Interactive Features: Hover effects on menu items, active state highlights on selected payment methods.

⚙ Backend (Python Flask)
The backend handles:

Serving the HTML/CSS/JS files.

Order Data Handling: Receives order details from the frontend in JSON format.

Billing Logic: Calculates the total price based on items and quantities.

Payment Processing Simulation: Verifies the chosen payment method and returns a confirmation message.

Clearing Cart: Resets the session/cart data after payment is processed.

API Routes:

/ → Serves the main UI.

/process_payment → POST API to handle payment and order clearing.

🔍 Core Logic Applied
Menu & Cart Logic (Frontend)

Items have prices stored in JavaScript objects.

Clicking “Add to Cart” increases quantity & updates total price dynamically.

Removing items updates the total in real time.

Order Type Selection

Toggle buttons update the selected state for Dine-In or Takeaway.

Payment Method Selection

JavaScript updates the selected payment method’s styling.

Sends the selected payment method to Flask API.

Total Calculation

The total is calculated dynamically in JS as items are added or removed.

Sent to backend for confirmation.

Backend Payment Processing

Receives cart details, order type, customer info, and payment method.

Simulates payment approval.

Sends back a Thank You message.

Cart Reset & UI Update

Once payment is processed, JS clears the cart and shows the Thank You message without page reload.

📂 Technologies Used
Frontend: HTML5, CSS3, JavaScript (Vanilla)

Backend: Python Flask

Data Exchange: JSON (AJAX fetch API)

Deployment Ready: Can be hosted on any Flask-supported platform (Heroku, Render, etc.)
