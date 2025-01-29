import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatLogo from "../assets/nfai.gif";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dynamicPrompts, setDynamicPrompts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // "success" or "error"
  const chatEndRef = useRef(null);

  const prompts = [
    { text: "Tell me about current market trends.", icon: "trending_up" },
    { text: "Give me tips for effective farming.", icon: "eco" },
    { text: "What are the latest agricultural tools?", icon: "construction" },
    { text: "How do I prevent crop diseases?", icon: "healing" },
    { text: "What fertilizers are best for rice?", icon: "science" },
    { text: "How to improve soil quality?", icon: "terrain" },
    { text: "Tips for organic farming.", icon: "spa" },
    { text: "Explain hydroponic farming.", icon: "water_drop" },
    { text: "What crops grow best in winter?", icon: "ac_unit" },
    { text: "How to control pests naturally?", icon: "bug_report" },
    { text: "Share the latest agriculture news.", icon: "newspaper" },
    { text: "Explain smart farming technologies.", icon: "smartphone" },
    { text: "Best irrigation techniques?", icon: "water" },
    { text: "How to set up a greenhouse?", icon: "house" },
    { text: "What is vertical farming?", icon: "vertical_align_top" },
    { text: "How to boost crop yield?", icon: "trending_up" },
    { text: "Latest advancements in agri-tech.", icon: "devices_other" },
    { text: "Best practices for seed storage.", icon: "inventory" },
    { text: "How to start sustainable farming?", icon: "eco" },
    { text: "What are the benefits of crop rotation?", icon: "repeat" },
  ];

  useEffect(() => {
    const shuffled = prompts.sort(() => 0.5 - Math.random());
    setDynamicPrompts(shuffled.slice(0, 5));
  }, []);

  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    const newMessage = { text: userMessage, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserMessage("");

    setIsTyping(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/Farmergpt/api/message", {
        message: userMessage,
      });

      setIsTyping(false);

      const botResponse = {
        text: response.data.response,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      setIsTyping(false);
      console.error("Error fetching the response:", error);
      handleAlert("There was an issue connecting to the server. Please try again.", "error");
    }
  };

  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text);
      handleAlert("Code copied to clipboard!", "success");
    } catch (error) {
      handleAlert("Failed to copy code. Please try again.", "error");
    }
  };

  const handleAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Automatically hide alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const renderMessage = (msg) => {
    if (msg.sender === "bot") {
      return (
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const code = String(children).trim();
              return !inline && match ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-300 shadow-md">
                  <SyntaxHighlighter
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: "8px",
                      padding: "1rem",
                      fontSize: "1rem",
                      backgroundColor: "#2d2d2d",
                      color: "#fff",
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => handleCopy(code)}
                    className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow hover:bg-gray-700"
                    style={{
                      top: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    Copy
                  </button>
                </div>
              ) : (
                <code className={`px-1 py-0.5 bg-gray-200 rounded`} {...props}>
                  {children}
                </code>
              );
            },
            p({ children }) {
              return (
                <p className="text-gray-800 text-base leading-relaxed mb-2">
                  {children}
                </p>
              );
            },
          }}
        >
          {msg.text}
        </ReactMarkdown>
      );
    } else {
      return msg.text;
    }
  };

  return (
    <section className="py-20 bg-gray-100 text-gray-900 relative">
      <div className="container mx-auto max-w-4xl px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-6 text-center">
          AI Chat Assistant
        </h2>
        <p className="text-gray-600 text-lg text-center mb-8">
          Get real-time answers to your agricultural queries, crop insights, and more!
        </p>

        {/* Alert */}
        {showAlert && (
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg flex items-center space-x-3 shadow-xl transition-all duration-300 ${
              alertType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
            style={{
              top: "10%", // Adjusted top to make sure it’s visible
              zIndex: 9999, // Keeps alert above all content
              width: "80%", // Ensure it’s wide enough on smaller screens
              maxWidth: "300px", // Reduced max width for better fit
            }}
          >
            <div
              className={`rounded-full p-2 ${
                alertType === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {alertType === "success" ? (
                <FiCheckCircle size={20} className="text-white" />
              ) : (
                <FiAlertCircle size={20} className="text-white" />
              )}
            </div>
            <span className="text-white font-medium text-sm">{alertMessage}</span>
          </div>
        )}

        {/* Chat Window */}
        <div className="border border-gray-300 rounded-[35px] shadow-lg bg-white overflow-hidden">
          <div className="p-4 h-[350px] overflow-y-auto space-y-4">
            {messages.length === 0 && !isTyping ? (
              <div className="text-center">
                <img
                  src={ChatLogo}
                  alt="Chat Logo"
                  className="mx-auto w-20 h-20 mb-4"
                  style={{ objectFit: "cover" }}
                />
                <p className="text-lg font-semibold text-gray-600 mb-4">
                  How can I assist you today?
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {dynamicPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setUserMessage(prompt.text)}
                      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full shadow-sm hover:bg-gray-200 transition"
                    >
                      <span className="material-icons text-sm mr-2">
                        {prompt.icon}
                      </span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-4 rounded-lg text-base max-w-md shadow-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-green-400 to-teal-400 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    style={{
                      fontSize: "1.125rem",
                      maxWidth: "80%",
                    }}
                  >
                    {renderMessage(msg)}
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="p-4 border-t border-gray-200 flex items-center bg-gray-50">
            <input
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition"
            />
            <button
              onClick={sendMessage}
              className="ml-4 px-5 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold rounded-full shadow-lg hover:scale-105 transform transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
