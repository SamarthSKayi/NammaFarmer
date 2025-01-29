from flask import Flask, Blueprint, request, jsonify, session
import psycopg2
from psycopg2.extras import RealDictCursor
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Flask app initialization
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")  # Secret key for sessions

# Connection string for PostgreSQL
CONNECTION_STRING = os.getenv("DATABASE_URL")

# Database Blueprint for organizing chat-related endpoints
chat_bp = Blueprint('chat', __name__)

# Connect to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(CONNECTION_STRING, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Table creation (ensure messages table exists)
def create_messages_table():
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS messages (
                        id SERIAL PRIMARY KEY,
                        user_id INT NOT NULL,  -- Reference to the user sending the message
                        text TEXT NOT NULL,  -- Message content
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Message timestamp
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  -- Foreign key constraint to users table
                    );
                """)
                conn.commit()
                print("Table 'messages' ensured to exist.")
        except Exception as e:
            print(f"Error creating table: {e}")
        finally:
            conn.close()

# Register the Blueprint with the app
app.register_blueprint(chat_bp)

# Create the table when the application starts
def initialize_database():
    create_messages_table()

# Define your routes here

@app.route("/login", methods=["POST"])
def login():
    # Implement login functionality (using email and password)
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Validate the user's credentials (you can implement this part as per your needs)
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, name, email, password FROM users WHERE email = %s", (email,))
                user = cursor.fetchone()

                if user and user[3] == password:  # Assuming password is stored in plaintext, but in reality, you'd hash it
                    session["user_id"] =1# user[0]
                    return jsonify({"message": "Login successful!"}), 200
                else:
                    return jsonify({"error": "Invalid credentials"}), 401
        except Exception as e:
            return jsonify({"error": f"Error logging in: {e}"}), 500
        finally:
            conn.close()
    return jsonify({"error": "Database connection failed"}), 500

@app.route("/api/send-message", methods=["POST"])
def send_message():
    if "user_id" not in session:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "Message text is required"}), 400

    user_id = session["user_id"]
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO messages (user_id, text) 
                    VALUES (%s, %s) RETURNING id, user_id, text, timestamp
                """, (user_id, text))
                message = cursor.fetchone()
                conn.commit()
                return jsonify({
                    "message": {
                        "id": message[0],
                        "user_id": message[1],
                        "text": message[2],
                        "timestamp": message[3]
                    }
                }), 200
        except Exception as e:
            return jsonify({"error": f"Error sending message: {e}"}), 500
        finally:
            conn.close()
    return jsonify({"error": "Database connection failed"}), 500

@app.route("/api/get-messages", methods=["GET"])
def get_messages():
    if "user_id" not in session:
        return jsonify({"error": "User not authenticated"}), 401

    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, user_id, text, timestamp FROM messages ORDER BY timestamp ASC")
                messages = cursor.fetchall()
                return jsonify({
                    "messages": [
                        {
                            "id": message[0],
                            "user_id": message[1],
                            "text": message[2],
                            "timestamp": message[3]
                        } for message in messages
                    ]
                }), 200
        except Exception as e:
            return jsonify({"error": f"Error retrieving messages: {e}"}), 500
        finally:
            conn.close()
    return jsonify({"error": "Database connection failed"}), 500

# Run the Flask app
if __name__ == "__main__":
    # Initialize the database (create the table if it doesn't exist)
    initialize_database()

    # Run the application
    app.run(host="0.0.0.0", port=5000)
