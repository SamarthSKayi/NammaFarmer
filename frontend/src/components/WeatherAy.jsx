import React, { useState } from "react";
import axios from "axios";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeatherAy() {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'

  // Handle city input change
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Handle city submit
  const handleCitySubmit = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/analyze/weather?city=${city}`
      );

      const fetchedData = response.data.forecast.map((day) => ({
        day: day.date,
        temp: day.avg_temperature,
        humidity: day.humidity,
        rainfall: day.rainfall || 0,
      }));

      setWeatherData(fetchedData);
      setAlertMessage("Weather data fetched successfully!");
      setAlertType("success");
      setShowAlert(true);
    } catch (err) {
      setError("Failed to fetch weather data.");
      setAlertMessage("Something went wrong, please try again.");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
      // Hide alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Display loading message or error if any
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6">
        Farm Analytics Dashboard
      </h1>

      {/* City Input and Submit Section */}
      <form
        onSubmit={handleCitySubmit}
        className="flex items-center justify-between mb-6"
      >
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          className="p-3 w-3/4 rounded-md border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Enter city name"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md ml-4 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Get Weather
        </button>
      </form>

      {/* Weather Insights Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-4">
          Weather Insights for {city}
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-700 p-4 rounded-lg flex items-center justify-between shadow-lg">
            <FiCheckCircle size={28} className="text-blue-500" />
            <div className="text-gray-800 dark:text-gray-100">
              Avg Temp: {weatherData[0]?.temp}°C
            </div>
          </div>

          <div className="bg-green-100 dark:bg-green-700 p-4 rounded-lg flex items-center justify-between shadow-lg">
            <FiXCircle size={28} className="text-green-500" />
            <div className="text-gray-800 dark:text-gray-100">
              Humidity: {weatherData[0]?.humidity}%
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-lg">
            <FiXCircle size={28} className="text-gray-500" />
            <div className="text-gray-800 dark:text-gray-100">
              Rainfall: {weatherData[0]?.rainfall}mm
            </div>
          </div>
        </div>
      </div>

      {/* Weather Chart Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={weatherData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ff7300"
              strokeWidth={3}
              name="Temperature (°C)"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#387908"
              strokeWidth={3}
              name="Humidity (%)"
            />
            <Line
              type="monotone"
              dataKey="rainfall"
              stroke="#0088FE"
              strokeWidth={3}
              name="Rainfall (mm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Success/Error Alert */}
      {showAlert && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 ${
            alertType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          } px-6 py-3 rounded-md flex items-center space-x-2 shadow-lg`}
          style={{ top: "80px", zIndex: 9999 }}
        >
          {alertType === "success" ? (
            <FiCheckCircle size={20} />
          ) : (
            <FiXCircle size={20} />
          )}
          <span>{alertMessage}</span>
        </div>
      )}
    </div>
  );
}
