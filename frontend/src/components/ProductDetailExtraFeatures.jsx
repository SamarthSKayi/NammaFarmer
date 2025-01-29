import React, { useState } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function ProductDetailExtraFeatures({ product, onSaveForLater, onAddToCart }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    message: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveForLater = () => {
    onSaveForLater(product);
    setAlertType("success");
    setAlertMessage("Product saved for later!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    setAlertType("success");
    setAlertMessage("Product added to cart!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handlePriceToggle = () => {
    setShowPriceDetails(!showPriceDetails);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setAlertType("success");
    setAlertMessage("Message sent to seller!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    handleModalClose();
  };

  return (
    <div>
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

      {/* Product Price Breakdown */}
      <div className="mt-4">
        <button className="text-sm text-blue-600" onClick={handlePriceToggle}>
          Price Breakdown
        </button>
        {showPriceDetails && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <p>Price: ₹{product.price}</p>
            <p>Shipping: ₹50</p>
            <p>Total: ₹{(product.price + 50).toFixed(2)}</p>
            <p>EMI Options Available</p>
          </div>
        )}
      </div>

      {/* Save for Later */}
      <div className="mt-6">
        <button
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          onClick={handleSaveForLater}
        >
          Save for Later
        </button>
      </div>

      {/* Social Share Buttons */}
     
    </div>
  );
}

export default ProductDetailExtraFeatures;
