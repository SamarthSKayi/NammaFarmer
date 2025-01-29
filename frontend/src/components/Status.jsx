import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import WeatherAy from "./WeatherAy";
import im1 from '../assets/i1.jpg'
import im2 from '../assets/i2.jpg'
import im3 from '../assets/i3.jpg'
import im4 from '../assets/i4.jpg'

export default function Status() {
  const [marketPrices, setMarketPrices] = useState([
    { crop: "Wheat", price: "₹1,800", market: "Delhi" },
    { crop: "Rice", price: "₹2,200", market: "Mumbai" },
    { crop: "Corn", price: "₹1,500", market: "Pune" },
  ]);
  
  useEffect(() => {
    // Example: Simulate fetching market data from an API.
    const fetchMarketData = async () => {
      // Simulated market data update (replace with actual API)
      setMarketPrices([
        { crop: "Wheat", price: "₹1,850", market: "Delhi" },
        { crop: "Rice", price: "₹2,300", market: "Mumbai" },
        { crop: "Corn", price: "₹1,600", market: "Pune" },
        { crop: "Barley", price: "₹2,000", market: "Kolkata" },
      ]);
    };
    fetchMarketData();
  }, []);

  return (
    <div style={{ width: "70vw", margin: "0 auto" }}>
      <h1 className="text-2xl font-semibold">Status</h1>
      <p className="text-gray-700 mt-2">View your current status and updates.</p>

      {/* Bootstrap Carousel */}
      <div id="carouselExampleCaptions" className="carousel slide mt-8" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={im1}
              className="d-block w-100"
              alt="Efficient Farming Techniques"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#FFD700" }}>Efficient Farming Techniques</h5>
              <p style={{ color: "#FFF" }}>Maximize yield with innovative farming practices.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={im2}
              className="d-block w-100"
              alt="Latest Market Updates"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#FFD700" }}>Latest Market Updates</h5>
              <p style={{ color: "#FFF" }}>Stay ahead by tracking real-time market prices.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={im3}
              className="d-block w-100"
              alt="Weather Forecast Insights"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#FFD700" }}>Weather Forecast Insights</h5>
              <p style={{ color: "#FFF" }}>Plan your activities with accurate weather updates.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src={im4}
              className="d-block w-100"
              alt="Sustainable Irrigation Systems"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "8px", padding: "10px" }}>
              <h5 style={{ color: "#FFD700" }}>Sustainable Irrigation Systems</h5>
              <p style={{ color: "#FFF" }}>Efficient irrigation methods for drought-prone areas.</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Weather Section */}
      <WeatherAy />

      {/* Market Prices */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Market Prices</h2>
        <p className="text-gray-600 mt-2">Check current market prices for your crops.</p>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Crop</th>
                <th>Price (per quintal)</th>
                <th>Market</th>
              </tr>
            </thead>
            <tbody>
              {marketPrices.map((price, index) => (
                <tr key={index}>
                  <td>{price.crop}</td>
                  <td>{price.price}</td>
                  <td>{price.market}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks and Reminders */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Tasks & Reminders</h2>
        <ul className="list-group mt-2">
          <li className="list-group-item">Fertilizer application due on Jan 10, 2025</li>
          <li className="list-group-item">Irrigation scheduled for Jan 12, 2025</li>
          <li className="list-group-item">Check for pest infestation in corn fields</li>
        </ul>
      </div>

      {/* Announcements */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <div className="alert alert-info mt-2" role="alert">
          "New government scheme launched: Subsidized seeds available. Apply before Feb 15, 2025."
        </div>
        <div className="alert alert-success mt-2" role="alert">
          "Organic farming webinar scheduled on Jan 20, 2025. Register now!"
        </div>
      </div>

      {/* New Services for Farmers */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">New Services for Farmers</h2>
        <ul className="list-group mt-2">
          <li className="list-group-item">Soil Testing and Consultation Service</li>
          <li className="list-group-item">Pest Control and Management</li>
          <li className="list-group-item">Farm Machinery Rental</li>
        </ul>
      </div>
    </div>
  );
}
