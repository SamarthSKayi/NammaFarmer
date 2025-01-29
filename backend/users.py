from flask import Blueprint, jsonify, request, session
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Connection string for PostgreSQL
CONNECTION_STRING = os.getenv("DATABASE_URL")

# Helper function to connect to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(CONNECTION_STRING, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Define the blueprint for user routes
users_bp = Blueprint('users', __name__)

# Route for user signup
@users_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')  # In production, ensure password is hashed!

    if not name or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return jsonify({'error': 'User already exists'}), 400

            cur.execute(
                "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id, name, email",
                (name, email, password)
            )
            conn.commit()

        return jsonify({'message': 'Signup successful!'}), 201

    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({'error': 'Internal server error'}), 500

    finally:
        if conn:
            conn.close()

# Route for user login
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')  # Ensure password verification in production!

    if not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500

        with conn.cursor() as cur:
            cur.execute("SELECT id, name, email FROM users WHERE email = %s AND password = %s", (email, password))
            user = cur.fetchone()

            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401

            # Set user ID in session
            session['user_id'] = user['id']

            return jsonify({'message': 'Login successful!', 'user': user}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': 'Internal server error'}), 500

    finally:
        if conn:
            conn.close()

# Route for user logout
@users_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user_id from session
    return jsonify({'message': 'Logged out successfully!'}), 200
