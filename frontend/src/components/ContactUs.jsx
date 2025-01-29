import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import contactImage from "../assets/contact.jpg"; // Replace with your actual contact image
import "./ContactUs.css";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [alertType, setAlertType] = useState("success");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Simulating submission (Replace with actual API call)
      const isSuccess = Math.random() > 0.5; // Replace with API success check
      if (isSuccess) {
        setToastMessage("Thank you for contacting us! We’ll get back to you soon.");
        setAlertType("success");
        setShowToast(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage("Failed to send your message. Please try again.");
        setAlertType("error");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="contact-page">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`toast-notification ${
            alertType === "success" ? "toast-success" : "toast-error"
          }`}
        >
          <div className="toast-content">
            <div className={`toast-icon ${alertType === "success" ? "bg-green-500" : "bg-red-500"}`}>
              {alertType === "success" ? (
                <FiCheckCircle size={20} className="text-white" />
              ) : (
                <FiAlertCircle size={20} className="text-white" />
              )}
            </div>
            <span>{toastMessage}</span>
          </div>
          <button className="toast-close" onClick={() => setShowToast(false)}>
            &times;
          </button>
        </div>
      )}

      <div className="contact-content">
        <div className="contact-form">
          <h2 className="contact-title">Contact NammaFarmer</h2>
          <p className="contact-subtitle">
            Have questions, feedback, or need help? Fill out the form below, and we’ll get back to
            you as soon as possible!
          </p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="name" className="floating-label">
                Your Name
              </label>
            </div>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="email" className="floating-label">
                Email Address
              </label>
            </div>
            <div className="input-group">
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <label htmlFor="message" className="floating-label">
                Your Message
              </label>
            </div>
            <button type="submit" className="cta-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-image">
          <img src={contactImage} alt="Contact illustration" />
        </div>
      </div>
    </div>
  );
}
