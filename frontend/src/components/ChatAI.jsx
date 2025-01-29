import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatLogo from "../assets/nfai.gif"; // Ensure this path is correct
import { FaBars, FaPlus, FaMoon, FaSun } from "react-icons/fa"; // Icons for toggle
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [dynamicPrompts, setDynamicPrompts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userChats, setUserChats] = useState([]); // Store all chat sessions
  const [isDarkMode, setIsDarkMode] = useState(true); // Track theme (dark by default)
  const chatEndRef = useRef(null);

  const TYPING_SPEED = 20; // Faster typing speed

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

    // Add user message to the current chat session
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserMessage("");

    setIsTyping(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/Farmergpt/api/message", {
        message: userMessage,
      });

      const responseText = response.data.response;

      let index = 0;

      const typeEffect = () => {
        if (index < responseText.length) {
          setTypingMessage((prev) => prev + responseText[index]);
          index++;
          setTimeout(typeEffect, TYPING_SPEED);
        } else {
          setIsTyping(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: responseText },
          ]);
          setTypingMessage("");
        }
      };

      typeEffect();
    } catch (error) {
      setIsTyping(false);
      console.error("Error fetching the response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, there was an issue with the backend. Please try again.",
          sender: "bot",
        },
      ]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleNewChat = () => {
    // Save the current session as a chat before starting a new one
    if (messages.length > 0) {
      setUserChats((prevChats) => [...prevChats, messages]);
    }
    setMessages([]); // Clear current chat
  };

  const loadChat = (chat) => {
    setMessages(chat); // Load the selected chat session
    setIsSidebarOpen(false); // Close sidebar when a chat is loaded
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode); // Toggle between dark and light mode
  };

  return (
    <section
      className={`h-full w-full ${isDarkMode ? "bg-[#212121]" : "bg-white"} text-white`}
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* Sidebar (Offcanvas) */}
      <div
        className={`fixed inset-0 bg-[#3C3D37] bg-opacity-70 z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed top-0 left-0 ${
          isDarkMode ? "bg-[#171717]" : "bg-[#ECDFCC]"
        } w-64 h-full shadow-lg z-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4">Previous Chats</h3>
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {userChats.map((chat, index) => (
              <li
                key={index}
                className="cursor-pointer p-2 rounded-md hover:bg-[#697565]"
                onClick={() => loadChat(chat)}
              >
                Chat {index + 1}
              </li>
            ))}
          </ul>
          {/* Static Start New Chat Button */}
          <div className="mt-auto flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="w-12 h-12 p-2 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
            >
              <FaPlus size={20} />
            </button>

            {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className="w-12 h-12 p-2 bg-[#697565] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:bg-[#3C3D37]"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="h-full w-full flex">
        {/* Main Chat Area */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            {/* Sidebar Toggle Button (Using Icon) */}
            <button
              onClick={toggleSidebar}
              className={`px-4 py-2 ${
                isDarkMode ? "bg-[#3C3D37]" : "bg-[#ECDFCC]"
              } text-white rounded-md hover:bg-[#697565]`}
            >
              <FaBars size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
  {messages.length === 0 && !isTyping ? (
    <div className="text-center">
      <img
        src={ChatLogo}
        alt="Chat Logo"
        className="mx-auto w-20 h-20 mb-4"
        style={{ objectFit: "cover" }}
      />
      <p className="text-lg font-semibold mb-4">
        How can I assist you today?
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        {dynamicPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => setUserMessage(prompt.text)}
            className="flex items-center px-3 py-2 bg-[#ECDFCC] text-[#3C3D37] text-sm font-medium rounded-full shadow-sm hover:bg-[#697565] transition"
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
        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`p-4 rounded-[25px] shadow-lg ${
            msg.sender === "user"
              ? `max-w-[80%] ${
                  isDarkMode ? "bg-[#303030] text-white" : "bg-[#181C14] text-black"
                }`
              : `max-w-[90%] ${
                  isDarkMode ? " text-white" : "bg-gray-100 text-black"
                }`
          }`}
          style={{
            lineHeight: "2.0",
            fontSize: ".9rem", // Larger font size
          }}
        >
          <ReactMarkdown
            children={msg.text}
            remarkPlugins={[remarkGfm]} // Enables support for GitHub-flavored Markdown
            components={{
              code: ({ inline, className, children, ...props }) => (
                <code
                  className={`${inline ? "bg-[#0D0D0D] text-black px-1 py-0.5 rounded" : "block p-3 rounded-lg bg-[#0D0D0D] text-white overflow-x-auto"} ${
                    className || ""
                  }`}
                  {...props}
                >
                  {children}
                </code>
              ),
            }}
          />
        </div>
      </div>
    ))
  )}

  {typingMessage && (
    <div className="flex justify-start">
      <div className="p-3 rounded-lg text-base max-w-sm shadow-lg bg-[#3C3D37] text-[#ECDFCC]">
        {typingMessage}
      </div>
    </div>
  )}

  {isTyping && (
    <div className="flex justify-start">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-[#ECDFCC] rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-[#ECDFCC] rounded-full animate-pulse delay-150"></div>
        <div className="w-2 h-2 bg-[#ECDFCC] rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  )}
</div>

{/* Sticky Footer for Input Field and Send Button */}
<div
  className={`sticky bottom-0 bg-${
    isDarkMode ? "[#212121]" : "white"
  } border-t ${
    isDarkMode ? "border-[#697565]" : "border-gray-200"
  } p-4 flex items-center gap-3 justify-center`}
>
  <input
    type="text"
    placeholder="Type your message..."
    value={userMessage}
    onChange={(e) => setUserMessage(e.target.value)}
    className={`w-3/4 md:w-2/3 lg:w-1/2 px-4 py-3 rounded-full focus:outline-none focus:ring-2 ${
      isDarkMode
        ? "bg-[#697565] text-white border border-[#697565] focus:ring-green-500"
        : "bg-gray-100 text-black border-gray-300 focus:ring-blue-400"
    } transition`}
  />
  <button
    onClick={sendMessage}
    disabled={isTyping}
    className={`px-5 py-3 rounded-full font-semibold shadow-lg transform transition-all hover:scale-105 ${
      isTyping
        ? "opacity-50 cursor-not-allowed"
        : "bg-gradient-to-r from-green-400 to-teal-400 text-white"
    }`}
  >
    Send
  </button>
</div>

        </div>
      </div>
    </section>
  );
}
