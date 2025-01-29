from flask import Blueprint, jsonify, request
import psycopg2
import os

# Create Flask app and Blueprint
chat_bp = Blueprint('chat', __name__)

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

# Route to save a message
@chat_bp.route('/api/save_message', methods=['POST'])
def save_message():
    # Get data from the request (assuming JSON)
    data = request.get_json()

    chat_room_id = data.get('chat_room_id')
    user_id = data.get('user_id')
    message = data.get('message')

    # Check if all necessary fields are provided
    if not chat_room_id or not user_id or not message:
        return jsonify({"error": "Missing required fields"}), 400

    # Connect to the database
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Query to insert the message into the messages table
        query = """
        INSERT INTO messages (chat_room_id, user_id, message)
        VALUES (%s, %s, %s);
        """
        cursor = conn.cursor()
        cursor.execute(query, (chat_room_id, user_id, message))
        conn.commit()  # Commit the transaction
        cursor.close()

        return jsonify({"message": "Message saved successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Route to fetch all messages in a specific chat room
@chat_bp.route('/api/messages/<chat_room_id>', methods=['GET'])
def get_messages_by_chat_room(chat_room_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Failed to connect to database"}), 500

    try:
        # Query to fetch all messages in the given chat room
        query = """
        SELECT 
            id, 
            chat_room_id, 
            user_id, 
            message, 
            created_at 
        FROM messages
        WHERE chat_room_id = %s
        ORDER BY created_at DESC;
        """
        cursor = conn.cursor()
        cursor.execute(query, (chat_room_id,))
        rows = cursor.fetchall()
        conn.close()

        # Convert rows to a list of dictionaries
        messages = [
            {
                "id": row[0],
                "chat_room_id": row[1],
                "user_id": row[2],
                "message": row[3],
                "created_at": row[4].strftime('%Y-%m-%d %H:%M:%S')  # Format timestamp
            }
            for row in rows
        ]

        return jsonify(messages), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
