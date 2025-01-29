import React, { useState, useEffect } from "react";
import axios from "axios";
import AlertMessage from "./AlertMessage"; // Import the AlertMessage component
import { FiCheckCircle, FiXCircle } from "react-icons/fi"; // For styling consistency

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const conversionRate = 82.5; // Example conversion rate for Rupees

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/listings/api/products")
      .then((response) => {
        const productsInRupees = response.data.map((product) => ({
          ...product,
          price: product.price * conversionRate, // Convert price to rupees
        }));
        setProducts(productsInRupees);
        setFilteredProducts(productsInRupees);
        showAlertMessage("Products loaded successfully!", "success");
      })
      .catch((error) => {
        showAlertMessage("Error fetching products!", "error");
        console.error("Error fetching listings!", error);
      });
  }, []);

  // Alert handling
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Auto-hide alert after 3 seconds
  };

  // Filter and Search Logic
  useEffect(() => {
    const results = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory ? product.category === filterCategory : true)
      );
    });
    setFilteredProducts(results);
  }, [searchTerm, filterCategory, products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* AlertMessage Component */}
      <AlertMessage
        showAlert={showAlert}
        alertMessage={alertMessage}
        alertType={alertType}
      />

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Product Catalog
      </h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
        />

        {/* Filter Dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Category A">Category A</option>
          <option value="Category B">Category B</option>
          <option value="Category C">Category C</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-2">₹{product.price.toFixed(2)}</p>
                <button
                  onClick={() => {
                    showAlertMessage(`Added ${product.name} to cart!`, "success");
                  }}
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCatalog;
