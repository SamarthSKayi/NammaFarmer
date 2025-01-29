import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Header({ toggleDarkMode, isDarkMode }) {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWeatherBlock, setShowWeatherBlock] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city to fetch weather data.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:5000/weather?city=${city}`);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setShowWeatherBlock(true); // Show the weather block
      } else {
        setError('Failed to fetch weather data.');
      }
    } catch (err) {
      setError('An error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const closeWeatherBlock = () => {
    setShowWeatherBlock(false);
    setWeatherData(null);
    setError(null);
  };

  const kelvinToCelsius = (temp) => Math.round(temp - 273.15);
  const kelvinToFahrenheit = (temp) => Math.round((temp - 273.15) * 9 / 5 + 32);

  return (
    <div className="relative">
      {/* Header Section */}
      <header className="header flex flex-col md:flex-row justify-between items-center bg-green-600 text-white px-4 py-2 shadow-md">
        {/* Logo */}
        <h1 className="text-2xl font-bold">NammaFarmer</h1>

        {/* Navigation */}
        <nav className="flex space-x-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-white font-bold underline'
                : 'text-white hover:text-gray-200'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/Market"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-bold underline'
                : 'text-white hover:text-gray-200'
            }
          >
            Market
          </NavLink>
          <NavLink
            to="/AI"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-bold underline'
                : 'text-white hover:text-gray-200'
            }
          >
            AI
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-bold underline'
                : 'text-white hover:text-gray-200'
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-bold underline'
                : 'text-white hover:text-gray-200'
            }
          >
            Account
          </NavLink>
        </nav>

        {/* Weather Search */}
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Enter city"
            className="rounded-lg px-2 py-1 text-black"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            onClick={fetchWeather}
            className="bg-white text-green-600 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            Get Weather
          </button>
          <button className="toggle-dark-mode ml-4" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Weather Data Block */}
      {showWeatherBlock && weatherData && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white text-black p-6 rounded-lg shadow-lg mt-20 w-96 z-50">
          <button
            onClick={closeWeatherBlock}
            className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
          >
            ✖
          </button>
          <h2 className="text-lg font-bold mb-2">
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <img
              className="w-16 h-16"
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
            <div>
            <div className="flex items-center space-x-2">
        <img
          className="w-5 h-5"
          src="https://img.icons8.com/ios/452/temperature.png"
          alt="Temperature"
        />
        <div className="text-xl font-bold">
          {kelvinToCelsius(weatherData.main.temp)}°C / {kelvinToFahrenheit(weatherData.main.temp)}°F
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <img
          className="w-5 h-5"
          src="https://img.icons8.com/ios/452/humidity.png"
          alt="Humidity"
        />
        <p className="text-sm text-gray-700">Humidity: {weatherData.main.humidity}%</p>
      </div>
      <div className="flex items-center space-x-2">
        <img
          className="w-5 h-5"
          src="https://img.icons8.com/ios/452/wind.png"
          alt="Wind Speed"
        />
        <p className="text-sm text-gray-700">Wind Speed: {weatherData.wind.speed} m/s</p>
      </div>
              <p className="text-sm text-gray-700">
                Precipitation: {weatherData.weather[0].main === 'Rain' ? 'Rainy' : 'Clear'}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-md font-semibold mb-2">Tips for Farmers:</h3>
      <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
        <li className="flex items-center space-x-2">
          <span>🌾</span>
          <span>
            {weatherData.weather[0].main === 'Rain'
              ? "Rainy weather, no need to water your crops today."
              : "Clear skies, consider irrigating your crops."}
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <span>🌾</span>
          <span>
            {kelvinToCelsius(weatherData.main.temp) < 10
              ? "Cold temperatures, protect crops from frost."
              : "Warm weather, frost is unlikely today."}
          </span>
        </li>
        <li className="flex items-center space-x-2">
          <span>🌾</span>
          <span>
            {weatherData.wind.speed > 10
              ? "Strong winds detected, secure equipment."
              : "Light winds, safe for outdoor activities."}
          </span>
        </li>
      </ul>
    </div>
        </div>
      )}

      {/* Loading and Error */}
      {loading && <p className="text-sm mt-2">Fetching weather data...</p>}
      {error && <p className="text-sm text-red-300 mt-2">{error}</p>}
    </div>
  );
}
