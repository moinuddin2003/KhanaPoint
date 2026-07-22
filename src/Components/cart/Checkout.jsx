import { useState } from "react";
import Button from "../common/Button";

import { BASE_URL } from "../../services/authApi";
export default function Checkout({
  confirm,
  cartItems,
  totalPrice,
  onIncrease,
  onDecrease,
}) {
  console.log("Checkout:", cartItems);

  // 1. Dynamic Form States
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Defaulting to "cash" (e.g., Cash on Delivery)
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  // Constants
  const deliveryFee = 2;
  const discount = totalPrice > 50 ? 10 : 0;
  const finalTotal = totalPrice + deliveryFee - discount;

  // Handle Checkout submission
  const handleSubmitOrder = () => {
    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address.");
      return;
    }
    setError("");

    // Send the dynamically collected state matching the Django API schema
    confirm({
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      transaction_id: transactionId,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Back */}
      <button className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black">
        ← Back
      </button>

      {/* Heading */}
      <h1 className="mb-8 text-4xl font-bold">Order Checkout</h1>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Section - Items & Shipping Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items Card */}
          <div className="rounded-2xl bg-white shadow-lg">
            <div className="flex items-center justify-between border-b p-6">
              <div className="flex items-center gap-3 font-semibold">
                <i className="fa-solid fa-cart-shopping"></i>
                My Cart
              </div>
            </div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b p-6"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={
                      item.image
                        ? `${localStorage.getItem("BASE_URL") || BASE_URL}${item.image}`
                        : "https://placehold.co/128x96?text=No+Image"
                    }
                    alt={item.name}
                    className="h-24 w-32 rounded-lg object-cover"
                  />

                  <div className="max-w-md">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {item.restaurant || "Tasty Restaurant"}
                    </p>
                    <p className="mt-3 text-sm font-semibold">
                      Type: {item.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Quantity Actions */}
                  <div className="flex items-center gap-4 rounded-full border px-4 py-2">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => onIncrease(item.id)}
                      className="text-xl font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Price Display */}
                  <h4 className="font-bold whitespace-nowrap">
                    £{(item.price * item.quantity).toFixed(2)}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Details Form Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg space-y-4">
            <h3 className="text-xl font-bold border-b pb-3">
              Delivery & Payment details
            </h3>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                placeholder="Enter your street address, apartment, or sector..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black bg-white"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="stripe">Stripe</option>
                  <option value="jazzcash">Jazz Cash</option>
                  <option value="easypaisa">Easy Paisa</option>
                </select>
              </div>

              {paymentMethod !== "cash" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Payment Ref/TXN ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Payment Summary */}
        {cartItems.length > 0 && (
          <div className="h-fit rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-3xl font-bold">Total Payment</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>£{deliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>£{finalTotal.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleSubmitOrder}
                className="mt-6 w-full rounded-lg py-3 font-semibold"
              >
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
