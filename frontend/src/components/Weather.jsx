import React, { useState } from 'react';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/weather?city=${city}`);
      if (response.ok) {
        const data = await response.json();

        // Assuming the data has the following structure:
        setWeatherData({
          city: data.city,
          description: data.description,
          temperature: data.temperature,
          humidity: data.humidity,
          wind_speed: data.wind_speed,
        });
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Check the Weather</h2>
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          placeholder="Enter city name"
          className="border rounded-l-lg px-4 py-2 w-full"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>
      {loading && <p className="text-center text-gray-600">Fetching weather data...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {weatherData && !error && (
        <div className="weather-details text-center mt-6">
          <h3 className="text-xl font-bold">{weatherData.city}</h3>
          <p className="text-gray-600">{weatherData.description}</p>
          <p className="text-lg font-bold">
            Temperature: {weatherData.temperature}°C
          </p>
          <p className="text-gray-600">Humidity: {weatherData.humidity}%</p>
          <p className="text-gray-600">Wind Speed: {weatherData.wind_speed} km/h</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
