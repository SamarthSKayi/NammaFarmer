import React from "react";

function CartPage({ cartItems, setCartItems }) {
  const handleRemoveFromCart = (itemIndex) => {
    const updatedCart = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(updatedCart);
  };

  const handleQuantityChange = (itemIndex, newQuantity) => {
    const updatedCart = [...cartItems];
    if (newQuantity > 0) {
      updatedCart[itemIndex].quantity = newQuantity;
      setCartItems(updatedCart);
    }
  };

  // Calculate total cost
  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-screen-xl mx-auto p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Cart</h1>
      {cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item, index) => (
            <div
              key={item.id} // Use unique id for better performance
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <span className="text-lg font-medium text-gray-800">{item.name}</span>
                <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(index, item.quantity - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(index, item.quantity + 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemoveFromCart(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <p className="text-lg font-semibold text-gray-800">Total: ${totalCost.toFixed(2)}</p>
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              onClick={() => alert("Proceeding to checkout!")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartPage;
