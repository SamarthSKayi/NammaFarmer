import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Your backend URL here

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatRoomId] = useState("room123"); // Example room ID
  const [userId] = useState("user123"); // Example user ID
  const [theme, setTheme] = useState("light"); // Toggle between light and dark mode
  const [isTyping, setIsTyping] = useState(false); // To manage typing indicator state
  const messagesEndRef = useRef(null); // For scrolling to the bottom of the messages

  // Fetch messages from backend on load
  useEffect(() => {
    axios
      .get(`http://localhost:5000/chat/api/messages/${chatRoomId}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => console.error("Error fetching messages:", error));

    // Listen for new messages from the backend (via Socket.IO)
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for typing status updates
    socket.on("typing", (data) => {
      if (data.chatRoomId === chatRoomId && data.userId !== userId) {
        setIsTyping(true);
        clearTimeout(window.typingTimeout); // Reset previous typing timeout
        window.typingTimeout = setTimeout(() => {
          setIsTyping(false); // Stop typing indicator after a delay
        }, 2000); // Typing timeout
      }
    });

    // Cleanup the socket connection on unmount
    return () => {
      socket.off("message");
      socket.off("typing");
    };
  }, [chatRoomId, userId]);

  // Handle sending a message
  const sendMessage = () => {
    if (message.trim()) {
      // Emit message to backend (via Socket.IO)
      socket.emit("send_message", { chatRoomId, userId, message });

      // Send the message to the backend to save in the database
      axios
        .post("http://localhost:5000/chat/api/save_message", {
          chat_room_id: chatRoomId,
          user_id: userId,
          message,
        })
        .then(() => {
          setMessage(""); // Clear message input after sending
        })
        .catch((error) => console.error("Error saving message:", error));
    }
  };

  // Handle typing event
  const handleTyping = () => {
    if (message.trim()) {
      socket.emit("typing", { chatRoomId, userId });
    }
  };

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle theme (Light/Dark Mode)
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div style={{width:"200 "}}
      className={`flex flex-col h-full max-w-lg mx-auto ${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-white"
      } shadow-lg rounded-lg p-6 transition-all duration-500`}
    >
      {/* Header Section with Theme Toggle */}
      <div className="flex justify-between items-center py-3 border-b">
        <div>
          <h1 className="text-3xl font-bold">Chat Room</h1>
          <p className="text-sm text-gray-500">Connect with others and chat</p>
        </div>
        <button
          onClick={toggleTheme}
          className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition-all"
        >
          {theme === "light" ? "🌙" : "🌞"}
        </button>
      </div>

      {/* Messages Container with Smooth Scrolling */}
      <div
        className="flex-1 overflow-y-auto mt-4 px-4 py-2 space-y-4"
        style={{ maxHeight: "500px", scrollbarWidth: "thin" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.user_id === userId ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              className={`relative ${
                msg.user_id === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              } p-4 rounded-lg max-w-xs shadow-lg`}
              style={{
                boxShadow: msg.user_id === userId ? "0px 4px 10px rgba(59, 130, 246, 0.2)" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Avatar */}
              <div className="absolute top-0 left-0 -translate-y-1/2 translate-x-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${msg.user_id}&background=random&color=fff`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
              <div>
                <div className="font-semibold">{msg.user_id}</div>
                <div className="text-sm mt-2">{msg.message}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-gray-500">
          <p>Someone is typing...</p>
        </div>
      )}

      {/* Message Input Area with Smooth Transition */}
      <div className="flex items-center space-x-3 mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleTyping} // Detect typing events
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}
