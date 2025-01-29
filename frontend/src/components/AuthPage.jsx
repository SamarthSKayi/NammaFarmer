import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import loginImage from "../assets/logsig.jpg";

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/login" : "/signup";
    const url = `http://127.0.0.1:5000/users${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Display success toast
        setToastMessage(isLogin ? "Login successful!" : "Signup successful!");
        setShowToast(true);

        // Hide toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);

        // Notify parent component
        onAuth();
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(result.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      {/* Toast Notification */}
      {showToast && (
        <div
          className="toast align-items-center position-fixed top-0 end-0 m-3 bg-success text-white"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 1055 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      )}

      <div className="auth-content">
        <div className="auth-form">
          <h2 className="auth-title">{isLogin ? "Welcome Back!" : "Join NammaFarmer"}</h2>
          <p classNaame="auth-subtitle">
            {isLogin
              ? "Log in to access your personalized dashboard."
              : "Sign up to connect with the farming community."}
          </p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="name" className="floating-label">Full Name</label>
              </div>
            )}
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="email" className="floating-label">Email Address</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password" className="floating-label">
                {isLogin ? "Password" : "Create Password"}
              </label>
            </div>
            <button type="submit" className="cta-btn">
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
          <p className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleForm} className="toggle-link">
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>

        <div className="auth-image">
          <img src={loginImage} alt="Login illustration" />
        </div>
      </div>
    </div>
  );
}
