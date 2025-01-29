import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import ProductCatalog from "./components/ProductCatalog";
import ChatApp from "./components/ChatAI";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ProductDetail from './components/ProductDetail';
import "./App.css";
import "./themes.css";
import CartPage from "./components/CartPage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load preferences and auth state from localStorage
    const darkModePreference = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModePreference);
    document.body.classList.toggle("dark-theme", darkModePreference);

    const authState = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authState);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-theme", !isDarkMode);
    localStorage.setItem("darkMode", !isDarkMode);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? "dark" : ""}`}>
        <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

        <div className="header-spacer"></div>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Market" element={<ProductCatalog/>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/AI" element={<ChatApp/>} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route
        path="/cart"
        element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />}
      />
            <Route
              path="/account"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthPage onAuth={handleAuthSuccess} />
                )
              }
            />
            <Route
              path="/dashboard/*"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/account" replace />
                )
              }
            />
          </Routes>
        </main>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
