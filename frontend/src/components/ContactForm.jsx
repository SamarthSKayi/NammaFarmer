import React, { useState } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import contactImage from "../assets/nf1.jpg"; // Replace with your actual contact image
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    // Simulate form submission
    const isSuccessful = Math.random() > 0.3; // Simulated success or failure
    if (isSuccessful) {
      setToast({ message: "Message sent successfully!", type: "success", visible: true });
      setFormData({ name: "", email: "", message: "" });
    } else {
      setToast({ message: "Failed to send the message. Please try again.", type: "error", visible: true });
    }
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  return (
    <div className="contact-container">
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`toast-notification ${
            toast.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          <div className="toast-content">
            <div
              className={`toast-icon ${
                toast.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {toast.type === "success" ? (
                <FiCheckCircle size={20} className="text-white" />
              ) : (
                <FiAlertCircle size={20} className="text-white" />
              )}
            </div>
            <span>{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => setToast({ ...toast, visible: false })}>
            &times;
          </button>
        </div>
      )}

      <div className="contact-wrapper">
        <div className="form-section">
          <h2 className="form-title">Get in Touch</h2>
          <p className="form-description">
            We’d love to hear from you! Whether you have a question, feedback, or need support, feel
            free to reach out to us.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? "error-border" : ""}`}
              />
              <label htmlFor="name" className="form-label">
                Your Name
              </label>
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? "error-border" : ""}`}
              />
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className={`form-input ${errors.message ? "error-border" : ""}`}
              ></textarea>
              <label htmlFor="message" className="form-label">
                Your Message
              </label>
              {errors.message && <p className="error-text">{errors.message}</p>}
            </div>

            <button type="submit" className="cta-button">
              Send Message
            </button>
          </form>
        </div>

        <div className="image-section">
          <img src={contactImage} alt="Contact Us" className="contact-image" />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
