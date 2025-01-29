import React, { useState, useEffect } from "react";
import { FiSend } from "react-icons/fi";

const Messenger = ({ sellerName, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "seller", text: "Hello, how can I help you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: newMessage },
      ]);
      setNewMessage(""); // Clear the input field
    }
  };

  useEffect(() => {
    // Simulate seller's response with a delay
    if (messages[messages.length - 1].sender === "user") {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "seller", text: "I'm here to help!" },
        ]);
      }, 1500);
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Chat with {sellerName}</h2>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageChange}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
