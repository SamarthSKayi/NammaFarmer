import React, { useState, useEffect } from "react";
import "./Home.css";
import localVideo from "../assets/nammaFarmer.mp4";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cropsData } from "./cropsData"; // Assuming cropsData contains monthly crop price data
import AIChat from "./AIChat";

export default function Home() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat"); // Default crop
  const [graphData, setGraphData] = useState(cropsData[selectedCrop]); // Default crop data
  const [chatMessages, setChatMessages] = useState([]); // Chat messages state
  const [chatInput, setChatInput] = useState(""); // Input for AI chat

  // Timer for updating the time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;

    // Add user's message to chat
    const newMessage = { type: "user", text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear the input box
    setChatInput("");

    try {
      // Simulate AI response (replace this with an actual API call)
      const response = await simulateAIResponse(chatInput);
      const aiMessage = { type: "ai", text: response };
      setChatMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  // Simulated AI response function (replace with an API call if needed)
  const simulateAIResponse = (query) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(`I'm here to help with: "${query}". Let me know more!`);
      }, 1000);
    });

  
  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update graph data when the selected crop changes
  const handleCropChange = (event) => {
    const crop = event.target.value;
    setSelectedCrop(crop);
    setGraphData(cropsData[crop]);
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[65vh] flex items-center justify-center bg-gray-100">
        <div className="relative w-[93vw] h-[85%] rounded-[30px] overflow-hidden shadow-lg">
          <video
            className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-50 contrast-110"
            src={localVideo}
            autoPlay
            muted
            loop
          ></video>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                Transforming Agriculture, Empowering Farmers
              </h1>
              <p className="text-sm sm:text-md md:text-lg lg:text-xl leading-relaxed mb-6">
                Discover innovative tools, real-time analytics, and sustainable solutions designed to help farmers grow smarter and thrive in an evolving world.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-2 sm:px-8 sm:py-3 bg-green-500 text-xs sm:text-sm md:text-base font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
                  Get Started
                </button>
                <button
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-green-600 text-xs sm:text-sm md:text-base font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
                  onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-tl from-gray-50 via-gray-100 to-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-green-700 mb-10 text-center">
            Why Choose Us
          </h2>
          <p className="text-gray-700 mb-12 text-lg text-center max-w-3xl mx-auto">
            We combine cutting-edge technology with sustainable practices to bring you insights and solutions that transform the way you manage your crops and business. Here's how we can help you grow:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { title: "AI-Driven Insights", description: "Leverage advanced data analytics for better decision-making and crop management.", icon: "📊" },
              { title: "Sustainable Practices", description: "Adopt eco-friendly techniques for a greener and more sustainable tomorrow.", icon: "🌱" },
              { title: "Global Market Access", description: "Connect with markets and buyers around the world, seamlessly and efficiently.", icon: "🌍" },
              { title: "Real-Time Monitoring", description: "Monitor crop health and weather conditions in real-time to optimize growth.", icon: "🌦️" },
            ].map((feature, index) => (
              <div key={index} className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:border-gray-300 transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 -mt-8 flex justify-center items-center">
                  <div className="bg-gray-100 text-gray-600 rounded-full p-4 shadow-sm transform transition-all duration-300">
                    <span className="text-4xl">{feature.icon}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-12">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Data Insights Section */}
          <h4 className="text-1xl md:text-1xl font-semibold text-green-700 mb-4 text-center">Data Insights</h4>
          {/* Crop Selector */}
          <div className="flex justify-center mb-6">
  <select
    value={selectedCrop}
    onChange={handleCropChange}
    className="p-3 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring focus:ring-green-500 transition duration-300 ease-in-out bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-gray-700 font-semibold"
  >
    {Object.keys(cropsData).map((crop) => (
      <option
        key={crop}
        value={crop}
        className="bg-white hover:bg-green-200"
      >
        {crop}
      </option>
    ))}
  </select>
</div>


          {/* Graph */}
          <div className="w-full h-[400px] rounded-2xl shadow-lg p-6 flex items-center justify-center bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="month" stroke="#4CAF50" tick={{ fontSize: 14, fill: "#4CAF50", fontWeight: "bold" }} axisLine={{ stroke: "#4CAF50", strokeWidth: 2 }} />
                <YAxis stroke="#4CAF50" tick={{ fontSize: 14, fill: "#4CAF50", fontWeight: "bold" }} axisLine={{ stroke: "#4CAF50", strokeWidth: 2 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 5, border: "1px solid #ddd" }} />
                <Area type="monotone" dataKey="value" stroke="#4CAF50" fill="url(#gradient)" strokeWidth={3} dot={{ fill: "#4CAF50", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <AIChat/>

      {/* Other Sections */}
      
      {/* Testimoniaals, Call to Action, Footer */}

    </div>
  );
}
