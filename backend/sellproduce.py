from flask import Blueprint, jsonify, request, session
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Blueprint for sell produce
sellproduce_bp = Blueprint('sellproduce', __name__)

# Connection string for PostgreSQL
CONNECTION_STRING = os.getenv("DATABASE_URL")

# Connect to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(CONNECTION_STRING, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Get all products for the logged-in seller
@sellproduce_bp.route('/products', methods=['GET'])
def get_products():
    seller_id = 1 #session.get('user_id')
    if not seller_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM products WHERE seller_id = %s", (seller_id,))
            products = cur.fetchall()
        conn.close()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add a new product for the logged-in seller
@sellproduce_bp.route('/products', methods=['POST'])
def add_product():
    seller_id = 2#session.get('user_id')
    if not seller_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO products (name, category, price, quantity, sales, profit, description, status, image, seller_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *;
                """,
                (data['name'], data['category'], float(data['price']), int(data['quantity']),
                 data.get('sales', 0), data.get('profit', 0), data['description'], 
                 data['status'], data.get('image', None), seller_id)
            )
            new_product = cur.fetchone()
        conn.commit()
        conn.close()
        return jsonify(new_product), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update a product
@sellproduce_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    seller_id =1# session.get('user_id')
    if not seller_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE products
                SET name=%s, category=%s, price=%s, quantity=%s, sales=%s,
                    profit=%s, description=%s, status=%s, image=%s
                WHERE id=%s AND seller_id=%s RETURNING *;
                """,
                (data['name'], data['category'], float(data['price']), int(data['quantity']),
                 data['sales'], data['profit'], data['description'], data['status'], 
                 data.get('image', None), id, seller_id)
            )
            updated_product = cur.fetchone()
        conn.commit()
        conn.close()
        if updated_product:
            return jsonify(updated_product), 200
        else:
            return jsonify({"error": "Product not found or unauthorized"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a product
@sellproduce_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    seller_id =1# session.get('user_id')
    if not seller_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM products WHERE id=%s AND seller_id=%s RETURNING *;", (id, seller_id))
            deleted_product = cur.fetchone()
        conn.commit()
        conn.close()
        if deleted_product:
            return jsonify(deleted_product), 200
        else:
            return jsonify({"error": "Product not found or unauthorized"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
