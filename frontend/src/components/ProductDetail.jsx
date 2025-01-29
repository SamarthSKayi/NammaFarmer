import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi"; // Import icons for success and error alerts
import ProductDetailExtraFeatures from "./ProductDetailExtraFeatures"; 

function ProductDetails() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showAlert, setShowAlert] = useState(false); // Alert visibility state
  const [alertType, setAlertType] = useState(""); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState(""); // Message content for the alert

  useEffect(() => {
    // Fetch product details from the API
    axios
      .get(`http://127.0.0.1:5000/listings/api/product/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching product details");
        setLoading(false);
        console.error(error);
      });
  }, [id]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulate sending the message to the seller (you can add your API here)
    console.log("Message sent:", contactInfo);

    // Show success alert
    setAlertType("success");
    setAlertMessage("Message sent successfully!");
    setShowAlert(true);

    // Close the modal
    setIsModalOpen(false);

    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleAddToCart = () => {
    // Simulate adding the product to the cart
    console.log("Product added to cart");

    // Show success alert
    setAlertType("success");
    setAlertMessage("Product added to cart successfully!");
    setShowAlert(true);

    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleSaveForLater = () => {
    // Simulate saving the product for later
    console.log("Product saved for later");

    // Show success alert
    setAlertType("success");
    setAlertMessage("Product saved for later!");
    setShowAlert(true);

    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white p-8">
      {/* Alert Section */}
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

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <a href="/" className="hover:text-blue-500">Home</a> &gt;{" "}
        <a href="/products" className="hover:text-blue-500">Products</a> &gt;{" "}
        <span className="text-gray-800">{product.name}</span>
      </nav>

      {product && (
        <>
          {/* Product Header */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Image */}
            <div className="flex-shrink-0 w-full lg:w-1/2">
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Details */}
            <div className="flex-grow w-full lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-lg text-gray-600 mt-2">Price: ₹{product.price.toFixed(2)}</p>

              {/* Stock Status */}
              <p className={`mt-1 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>

              {/* Ratings */}
              <div className="flex items-center mt-4">
                <div className="flex text-yellow-500">
                  {Array.from({ length: Math.round(product.rating || 0) }, (_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                  {Array.from({ length: 5 - Math.round(product.rating || 0) }, (_, i) => (
                    <span key={i} className="text-gray-300">&#9733;</span>
                  ))}
                </div>
                <p className="ml-2 text-gray-500 text-sm">({product.reviewsCount || 0} reviews)</p>
              </div>

              {/* Region & Category */}
              <p className="text-gray-500 mt-3 text-sm">
                <span className="font-medium">Region:</span> {product.region} |{" "}
                <span className="font-medium">Category:</span> {product.category}
              </p>

              {/* Promotional Offer */}
              {product.offer && (
                <div className="mt-4 bg-blue-100 text-blue-700 p-3 rounded-md">
                  <p>{product.offer}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
                {/* Show Contact Seller button only after action is taken */}
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  onClick={handleModalOpen}
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Description</h2>
            <p className="text-gray-700 mt-2">{product.description}</p>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {product.reviews.map((review, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i}>&#9733;</span>
                        ))}
                      </div>
                      <p className="ml-2 text-gray-500 text-xs">- {review.user}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No reviews yet.</p>
            )}
          </div>
        </>
      )}

      {/* Contact Seller Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Seller</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-700" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={contactInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={contactInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={contactInfo.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleModalClose}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <ProductDetailExtraFeatures
        product={product}
        onSaveForLater={handleSaveForLater}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default ProductDetails;
