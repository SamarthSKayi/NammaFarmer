from flask import Blueprint, request, jsonify
import requests
import os

# Create a Blueprint for ChatGPT
chatgpt_bp = Blueprint('chatgpt', __name__)

# API credentials
RAPIDAPI_KEY = os.getenv("GPT_KEY")
RAPIDAPI_HOST = "chatgpt-vision1.p.rapidapi.com"
API_URL = "https://chatgpt-vision1.p.rapidapi.com/gpt4"

@chatgpt_bp.route('/api/message', methods=['POST', 'OPTIONS'])
def get_bot_response():
    # Handle preflight OPTIONS request for CORS
    if request.method == 'OPTIONS':
        return jsonify({"message": "Preflight check successful"}), 200

    try:
        # Process the POST request
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "Message is required!"}), 400

        # Prepare the payload for the API request
        payload = {
            "messages": [{"role": "user", "content": user_message}],
            "web_access": False
        }

        # Prepare the headers for the API request
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }

        # Send request to the external API (ChatGPT)
        response = requests.post(API_URL, json=payload, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            bot_response = response.json().get("result")
            return jsonify({"response": bot_response}), 200
        else:
            return jsonify({"error": "Failed to get a response from the bot."}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
