import React, { useState, useEffect } from "react";
import { FaEdit, FaMapMarkerAlt, FaArrowUp, FaArrowDown, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { Line } from "react-chartjs-2";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [productInsights, setProductInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = "Razik"; // Replace with dynamic username if needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`http://127.0.0.1:5000/profile/${username}`);
        const productResponse = await axios.get(`http://127.0.0.1:5000/profile/${username}/product-insights`);

        setProfile(profileResponse.data);
        setProductInsights(productResponse.data);
      } catch (error) {
        console.error("Error fetching profile or product insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6 space-y-6 bg-gray-50" style={{ width: "73vw" }}>
      {/* Profile Overview Section */}
      <div className="bg-gradient-to-r from-teal-500 to-green-700 text-white rounded-lg p-3 shadow-md flex items-center gap-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="w-16 h-16 rounded-full border-4 border-white shadow-md"
          />
          <button className="absolute bottom-0 right-0 bg-white text-teal-600 rounded-full p-1 shadow hover:bg-gray-100 transition">
            <FaEdit size={14} />
          </button>
        </div>

        {/* Personal Details */}
        <div className="flex-1 text-sm">
          <h1 className="text-xl font-semibold">{profile.name}</h1>
          <p className="text-xs text-teal-200">{profile.email}</p>
          <p className="flex items-center gap-1 text-xs mt-1">
            <FaMapMarkerAlt />
            <span>{profile.location_name || "Location not set"}</span>
          </p>
          <p className="text-xs text-gray-200 mt-1">
            <span className="font-medium">Member Since:</span> {profile.member_since || "N/A"}
          </p>
        </div>
      </div>

      {/* Product Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productInsights.length > 0 ? (
          productInsights.map((product) => {
            // Logic for determining profit or loss
            const profit = product.total_profit;
            const loss = product.loss;

            return (
              <div
                key={product.product_name}
                className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-teal-600">{product.product_name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{product.category}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-700">Price</p>
                    <h4 className="text-sm font-bold text-teal-600">₹{product.price}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-700">Quantity</p>
                    <h4 className="text-sm font-bold text-gray-600">{product.quantity}</h4>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-700">Sales</p>
                    <h4 className="text-sm font-bold text-teal-600">{product.sales}</h4>
                  </div>
                </div>

                {/* Profit/Loss Section */}
                <div
                  className={`mt-3 px-2 py-1 rounded-lg flex items-center justify-between ${
                    profit > 0
                      ? "bg-green-100 text-green-600"
                      : loss > 0
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {profit > 0 ? (
                      <FaArrowUp size={16} />
                    ) : loss > 0 ? (
                      <FaArrowDown size={16} />
                    ) : (
                      <span>No Profit/Loss</span>
                    )}
                    <span className="font-medium text-xs">
                      {profit > 0
                        ? `Profit: ₹${profit}`
                        : loss > 0
                        ? `Loss: ₹${loss}`
                        : "No Profit/Loss"}
                    </span>
                  </div>
                  <FaRupeeSign size={18} />
                </div>

                {/* Chart Section for Graphical Insights */}
                {product.chartData && (
                  <div className="mt-3 h-24">
                    <Line
                      data={product.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-gray-500 text-center col-span-full">
            No product insights available.
          </div>
        )}
      </div>
    </div>
  );
}
