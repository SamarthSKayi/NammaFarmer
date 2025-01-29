from flask import Flask, Blueprint, jsonify, request
import psycopg2
import os

# Create Flask app and Blueprint
app = Flask(__name__)
products_bp = Blueprint('listings', __name__)

# Database connection string (set this in your environment)
CONNECTION_STRING = os.getenv("DATABASE_URL")

# Function to connect to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(CONNECTION_STRING)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Route to fetch all products
@products_bp.route('/api/products', methods=['GET'])
def get_all_products():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Query to fetch all products
        query = """
        SELECT 
            id, 
            name, 
            category, 
            price, 
            quantity, 
            description, 
            status, 
            image 
        FROM products;
        """
        cursor = conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()

        # Convert rows to a list of dictionaries
        products = [
            {
                "id": row[0],
                "name": row[1],
                "category": row[2],
                "price": float(row[3]),
                "quantity": row[4],
                "description": row[5],
                "status": row[6],
                "image": row[7],
            }
            for row in rows
        ]

        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Route to fetch a single product by ID
@products_bp.route('/api/product/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Query to fetch a single product by ID
        query = """
        SELECT 
            id, 
            name, 
            category, 
            price, 
            quantity, 
            description, 
            status, 
            image 
        FROM products
        WHERE id = %s;
        """
        cursor = conn.cursor()
        cursor.execute(query, (product_id,))
        row = cursor.fetchone()
        conn.close()

        if row is None:
            return jsonify({"error": "Product not found"}), 404

        product = {
            "id": row[0],
            "name": row[1],
            "category": row[2],
            "price": float(row[3]),
            "quantity": row[4],
            "description": row[5],
            "status": row[6],
            "image": row[7],
        }

        return jsonify(product), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Route to add a product to the cart
@products_bp.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    user_id = 1  # For now, assuming user_id is 1
    data = request.get_json()
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Check if the product exists in the products table
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM products WHERE id = %s", (product_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "Product not found"}), 404

        # Check if the product is already in the user's cart
        cursor.execute(
            "SELECT id FROM cart WHERE user_id = %s AND product_id = %s", (user_id, product_id)
        )
        existing_item = cursor.fetchone()
        
        if existing_item:
            # If the product is already in the cart, update the quantity
            cursor.execute(
                "UPDATE cart SET quantity = quantity + %s WHERE id = %s", 
                (quantity, existing_item[0])
            )
        else:
            # If the product is not in the cart, insert it
            cursor.execute(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)",
                (user_id, product_id, quantity)
            )
        
        conn.commit()
        conn.close()

        return jsonify({"message": "Product added to cart"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Route to get the user's cart
@products_bp.route('/api/cart', methods=['GET'])
def get_cart():
    user_id = 1  # For now, assuming user_id is 1
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Query to fetch products in the user's cart
        query = """
        SELECT 
            p.id, p.name, p.category, p.price, p.quantity, p.description, p.status, p.image, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s;
        """
        cursor = conn.cursor()
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return jsonify({"message": "Cart is empty"}), 200

        # Convert rows to a list of dictionaries
        cart_items = [
            {
                "id": row[0],
                "name": row[1],
                "category": row[2],
                "price": float(row[3]),
                "quantity": row[8],  # Quantity from the cart table
                "description": row[4],
                "status": row[5],
                "image": row[6],
            }
            for row in rows
        ]

        return jsonify(cart_items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Route to remove a product from the cart
@products_bp.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    user_id = 1  # For now, assuming user_id is 1
    data = request.get_json()
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Remove the product from the cart
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM cart WHERE user_id = %s AND product_id = %s",
            (user_id, product_id)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Product removed from cart"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

