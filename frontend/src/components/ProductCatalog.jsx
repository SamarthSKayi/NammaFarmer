import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheckCircle, FiAlertCircle, FiFilter, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function FarmersProduceCatalog() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]); // Example price range (₹0 - ₹1000)
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate(); // Used for navigation to ProductDetails page

  useEffect(() => {
    // Fetch products from API
    axios
      .get("http://127.0.0.1:5000/listings/api/products")
      .then((response) => {
        const data = response.data;

        // Extract unique categories and regions for filtering
        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        const uniqueRegions = [...new Set(data.map((product) => product.region))];

        setProducts(data);
        setFilteredProducts(data);
        setCategories(uniqueCategories);
        setRegions(uniqueRegions);
      })
      .catch((error) => {
        triggerAlert("Error fetching products!", "error");
        console.error(error);
      });
  }, []);

  // Alert Trigger Function
  const triggerAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  // Add to Cart Handler
  const handleAddToCart = (productName) => {
    setCartItems((prevItems) => [...prevItems, productName]);
    triggerAlert(`${productName} added to cart!`, "success");
  };

  // Navigate to Product Details Page
  const handleViewProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };
  useEffect(() => {
    const results = products.filter((product) => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesRegion = selectedRegion ? product.region === selectedRegion : true;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
  
      return matchesSearchTerm && matchesCategory && matchesRegion && matchesPrice;
    });
  
    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, selectedRegion, priceRange, products]);
  

  // Advanced Filtering Logic
  useEffect(() => {
    const results = products.filter((product) => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesRegion = selectedRegion ? product.region === selectedRegion : true;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearchTerm && matchesCategory && matchesRegion && matchesPrice;
    });

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, selectedRegion, priceRange, products]);

  // Toggle Sidebar
  const toggleFilterSidebar = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8 space-y-8 bg-gray-50">
      {/* Alert */}
      {showAlert && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg flex items-center space-x-3 shadow-xl transition-all duration-300 ${
            alertType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ top: "10%", zIndex: 9999 }}
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
      <div className="space-y-4">
      <div className="flex justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
  <input
    type="text"
    placeholder="Search for produce by name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full sm:w-96 px-5 py-3 text-lg placeholder-gray-400 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200 ease-in-out"
  />
</div>

    </div>
      {/* Filter Button (Dynamic Position) */}
      <button
        onClick={toggleFilterSidebar}
        className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-50"
      >
        <FiFilter size={24} />
      </button>

      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-end"
          onClick={toggleFilterSidebar}
        >
          <div className="bg-white w-96 p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold text-gray-800"></h2>

            {/* Category Filter */}
            <div>
              <label className="block text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-gray-700">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Regions</option>
                {regions.map((region, index) => (
                  <option key={index} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-gray-700">Price Range</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={toggleFilterSidebar}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg"
              >
                Close
              </button>
              <button
                onClick={toggleFilterSidebar}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-t-xl"
        />
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            {product.name}
          </h2>
          <p className="text-lg font-medium text-gray-700 mt-2">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-gray-500 mt-1 text-sm capitalize">
            {product.region} | {product.category}
          </p>
          <div className="mt-4 flex gap-3">
  <button
    onClick={() => handleAddToCart(product.name)}
    className="w-1/2 py-1.5 px-4 text-sm bg-blue-600 text-white font-medium rounded-lg"
  >
    Add to Cart
  </button>
  <button
    onClick={() => handleViewProductDetails(product.id)}
    className="w-1/2 py-1.5 px-4 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg"
  >
    Buy Now
  </button>
</div>

        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-600 col-span-full text-center text-lg">
      No products found.
    </p>
  )}
</div>


      {/* View Cart Section */}
<div
  onClick={() => navigate("/cart")}
  className="fixed bottom-6 left-6 p-3 bg-gray-800 text-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition"
>
  <h2 className="text-lg font-bold mb-2 flex items-center space-x-2">
    <FiShoppingCart size={20} /> <span>Cart</span>
  </h2>
  {cartItems.length > 0 ? (
    <ul className="space-y-1">
      {cartItems.map((item, index) => (
        <li key={index} className="text-sm">
          {item}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-400">Cart is empty.</p>
  )}
</div>

    </div>
  );
}

export default FarmersProduceCatalog;
