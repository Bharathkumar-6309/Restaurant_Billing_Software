from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

menu_data = [
    {"id": 1, "name": "Spring Rolls", "price": 180, "category": "Appetizers", "gst": 5, "desc": "Crispy vegetable spring rolls with sweet chili sauce"},
    {"id": 2, "name": "Chicken Wings", "price": 320, "category": "Appetizers", "gst": 5, "desc": "BBQ glazed chicken wings with ranch dip"},
    {"id": 3, "name": "Garlic Bread", "price": 150, "category": "Appetizers", "gst": 5, "desc": "Toasted bread with garlic butter and herbs"},
    {"id": 4, "name": "Paneer Butter Masala", "price": 250, "category": "Main Course", "gst": 5, "desc": "Rich paneer curry in buttery tomato gravy"},
    {"id": 5, "name": "Biryani", "price": 300, "category": "Main Course", "gst": 5, "desc": "Fragrant rice with spices and meat/vegetables"},
    {"id": 6, "name": "Coke", "price": 50, "category": "Beverages", "gst": 5, "desc": "Chilled soft drink"},
    {"id": 7, "name": "Ice Cream", "price": 80, "category": "Desserts", "gst": 5, "desc": "Creamy vanilla ice cream"}
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/menu")
def menu():
    # Return menu data and list of categories
    categories = ["All"] + sorted(list({item["category"] for item in menu_data}))
    return jsonify({"menu": menu_data, "categories": categories})

@app.route("/process_payment", methods=["POST"])
def process_payment():
    data = request.get_json()
    # In real app: validate, store order to DB, process payment gateway, etc.
    # Here we will just print/log and return success.
    print("Order received:", data)
    data["received_at"] = datetime.utcnow().isoformat()
    # Return a simulated response
    return jsonify({"success": True, "message": "Payment processed", "order": data})

if __name__ == "__main__":
    app.run(debug=True)
