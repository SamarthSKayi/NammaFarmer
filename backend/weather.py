# weather.py
from flask import Blueprint, jsonify, request
import requests

# Weather API configuration
RAPIDAPI_KEY = "2e9c095107msh3fd20e175baaa52p198020jsn2adcbf334b35"
RAPIDAPI_HOST = "weather-api99.p.rapidapi.com"
API_URL = "https://weather-api99.p.rapidapi.com/weather"

# Define the blueprint for weather routes
weather_bp = Blueprint('weather', __name__)

# Route for weather information
@weather_bp.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', default='London', type=str)
    
    # Set up headers and query parameters for the RapidAPI request
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST
    }
    
    querystring = {"city": city}
    
    # Make a GET request to the weather API
    response = requests.get(API_URL, headers=headers, params=querystring)
    
    # If the API responds successfully, return the data
    if response.status_code == 200:
        print(response.json())
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch weather data"}), 500
