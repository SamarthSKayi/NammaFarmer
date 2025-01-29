from flask import Blueprint, request, jsonify
import requests
import os

# Create a Blueprint for weather
wt_bp = Blueprint('weather-analyze', __name__)

# API credentials and configuration
RAPIDAPI_KEY = os.getenv("RPI_KEY_WT")  # Ensure the RAPIDAPI_KEY is set in your .env file
RAPIDAPI_HOST = "weatherapi-com.p.rapidapi.com"
API_URL = "https://weatherapi-com.p.rapidapi.com/forecast.json"

@wt_bp.route('/analyze/weather', methods=['GET'])
def analyze_weather():
    # Get the city name from the query string
    city_name = request.args.get('city')
    
    if not city_name:
        return jsonify({"error": "City parameter is required"}), 400

    try:
        # Prepare the query string for the weather request
        querystring = {"q": city_name, "days": "3"}  # Default to 3-day forecast
        
        # Prepare the headers for the API request
        headers = {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST
        }

        # Send request to the external WeatherAPI
        response = requests.get(API_URL, headers=headers, params=querystring)

        # Check if the request was successful
        if response.status_code == 200:
            weather_data = response.json()

            # Extract location data and forecast
            city = weather_data['location']['name']
            country = weather_data['location']['country']
            forecast_list = []

            for day in weather_data['forecast']['forecastday']:
                date = day['date']
                avg_temp = day['day']['avgtemp_c']  # Average temperature in Celsius
                condition = day['day']['condition']['text']  # Weather condition (e.g., "Clear", "Rain")
                wind_speed = day['day']['maxwind_kph']  # Max wind speed in km/h
                humidity = day['day']['avghumidity']  # Average humidity percentage

                # Add the data for each day to the forecast list
                forecast_list.append({
                    "date": date,
                    "avg_temperature": avg_temp,
                    "condition": condition,
                    "wind_speed": wind_speed,
                    "humidity": humidity
                })

            # Return the weather data as a JSON response
            return jsonify({
                "city": city,
                "country": country,
                "forecast": forecast_list
            }), 200
        
        else:
            return jsonify({"error": "Failed to fetch weather data"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
