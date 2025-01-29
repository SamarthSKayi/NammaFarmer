from flask import Flask, jsonify
from flask_cors import CORS
from flask_session import Session
from flask_socketio import SocketIO
from dotenv import load_dotenv
from users import users_bp  # User blueprint
from sellproduce import sellproduce_bp  # Sell Produce blueprint
from listings import products_bp  # Listings blueprint
from chatgpt import chatgpt_bp  # ChatGPT blueprint
from weather import weather_bp  # Weather blueprint
from profile.views import profile_bp
from wt import wt_bp 
from chat import chat_bp
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Setup CORS (Cross-Origin Resource Sharing)
CORS(app, supports_credentials=True)  # Enable cross-origin requests with credentials (cookies)

# Set up session configuration
app.secret_key = os.urandom(24)  # Use a secure secret key
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the filesystem
app.config['SESSION_PERMANENT'] = False  # Sessions are not permanent

Session(app)

# Initialize Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow cross-origin requests from any source

# Register blueprints for the various modules of your app
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(sellproduce_bp, url_prefix='/sellproduce')
app.register_blueprint(chatgpt_bp, url_prefix='/Farmergpt')
app.register_blueprint(weather_bp)
app.register_blueprint(products_bp, url_prefix='/listings')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(wt_bp)
app.register_blueprint(chat_bp, url_prefix='/chat')

# Test route to check if the backend is running correctly
@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is working fine!'}), 200

# SocketIO event handling
@socketio.on('connect')
def handle_connect():
    print('A user connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('A user disconnected')

@socketio.on('message')
def handle_message(msg):
    print(f"Message received: {msg}")
    # Broadcast the message to all connected clients (broadcast is not needed here)
    socketio.emit('message', msg)  # This will broadcast to all clients by default

if __name__ == "__main__":
    # Run the Flask app with SocketIO's run method
    socketio.run(app, debug=True)
