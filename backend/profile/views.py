from flask import Blueprint, jsonify, request, session
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Blueprint for user profile
profile_bp = Blueprint('profile', __name__)

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

# Get the profile of the logged-in user
@profile_bp.route('/profile', methods=['GET'])
def get_logged_in_user_profile():
    user_id = 1#session.get('user_id')  # Retrieve logged-in user ID from session

    if not user_id:
        return jsonify({'error': 'Unauthorized, please log in'}), 401

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT u.name, u.email, l.location_name AS location
                FROM users u
                LEFT JOIN profile p ON u.id = p.user_id
                LEFT JOIN locations l ON p.location_id = l.id
                WHERE u.id = %s
            """, (user_id,))
            profile = cur.fetchone()

        conn.close()

        if profile:
            return jsonify(profile), 200
        else:
            return jsonify({'error': 'Profile not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Get user profile by username
@profile_bp.route('/<string:username>', methods=['GET'])
def get_profile(username):
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT u.name, u.email, l.location_name
                FROM users u
                LEFT JOIN profile p ON u.name = p.username
                LEFT JOIN locations l ON p.location_id = l.id
                WHERE u.name = %s
            """, (username,))
            profile = cur.fetchone()
        
        conn.close()

        if profile:
            return jsonify(profile), 200
        else:
            return jsonify({"error": "Profile not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Create or update user profile
@profile_bp.route('/', methods=['POST'])
def create_or_update_profile():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    location_name = data.get('location')

    if not username or not email or not location_name:
        return jsonify({"error": "Missing required fields: name, email, and location"}), 400

    try:
        conn = get_db_connection()

        # Check if the user exists
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE name = %s AND email = %s", (username, email))
            user = cur.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404

            # Check if the location exists
            cur.execute("SELECT id FROM locations WHERE location_name = %s", (location_name,))
            location = cur.fetchone()

            if not location:
                return jsonify({"error": "Location not found"}), 404

            # Insert or update the profile
            cur.execute("""
                INSERT INTO profile (username, email, location_id)
                VALUES (%s, %s, %s)
                ON CONFLICT (username) DO UPDATE
                SET email = EXCLUDED.email, location_id = EXCLUDED.location_id
                RETURNING *;
            """, (username, email, location['id']))

            updated_profile = cur.fetchone()

        conn.commit()
        conn.close()

        return jsonify(updated_profile), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete user profile
@profile_bp.route('/<string:username>', methods=['DELETE'])
def delete_profile(username):
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Delete the profile for the given username
            cur.execute("DELETE FROM profile WHERE username = %s RETURNING *;", (username,))
            deleted_profile = cur.fetchone()

        conn.commit()
        conn.close()

        if deleted_profile:
            return jsonify(deleted_profile), 200
        else:
            return jsonify({"error": "Profile not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
@profile_bp.route('/<string:username>/product-insights', methods=['GET'])
def get_product_insights(username):
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Query to fetch product details and calculate profit/loss
            cur.execute("""
                SELECT 
                    p.name AS product_name,
                    p.category,
                    p.price,
                    p.quantity,
                    p.sales,
                    p.profit AS total_profit,
                    (p.price * p.sales) - p.profit AS loss
                FROM products p
                JOIN users u ON p.seller_id = u.id
                WHERE u.name = %s;
            """, (username,))
            products = cur.fetchall()

        conn.close()

        if products:
            return jsonify(products), 200
        else:
            return jsonify({"error": "No products found for this user"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500