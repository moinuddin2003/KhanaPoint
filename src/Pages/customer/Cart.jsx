import { useState, useEffect } from "react";
import Checkout from "../../Components/cart/Checkout";
import { useNavigate } from "react-router";
import { cartApi } from "../../services/authApi";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Order success state create karein
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res && res.data) {
        setCartItems(res.data.items || []);
        setTotalPrice(res.data.total_price || 0);
      }
    } catch (err) {
      setError("Failed to load cart items from server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleIncrease = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    try {
      const newQuantity = item.quantity + 1;
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)),
      );
      await cartApi.updateItemQuantity(id, newQuantity);
      fetchCartData();
    } catch (err) {
      console.error(err);
      fetchCartData();
    }
  };

  const handleDecrease = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity > 1) {
      try {
        const newQuantity = item.quantity - 1;
        setCartItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i)),
        );
        await cartApi.updateItemQuantity(id, newQuantity);
        fetchCartData();
      } catch (err) {
        console.error(err);
        fetchCartData();
      }
    } else {
      const isConfirmed = window.confirm(
        "Are you sure you want to remove this item?",
      );
      if (!isConfirmed) return;

      try {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
        await cartApi.deleteItem(id);
        fetchCartData();
      } catch (err) {
        console.error(err);
        fetchCartData();
      }
    }
  };

  const handleConfirmOrder = async (shippingDetails) => {
    try {
      const payload = {
        delivery_address: shippingDetails?.delivery_address || "",
        payment_method: shippingDetails?.payment_method || "cash",
        transaction_id: shippingDetails?.transaction_id || "",
      };

      if (!payload.delivery_address.trim()) {
        alert("Please provide a valid delivery address.");
        return;
      }

      await cartApi.checkout(payload);

      // 2. Order success state ko true karein
      setIsOrderPlaced(true);

      // Local cart state khali kar dein
      setCartItems([]);
      setTotalPrice(0);
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Cart...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  // 1. Agar order confirm ho gaya hai, toh Order Success Screen dikhaein
  if (isOrderPlaced) {
    return (
      <div className="mx-auto flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>
        <p className="mt-3 text-gray-500 max-w-md">
          Thank you for your purchase. Your delicious food is being prepared and
          will be on its way soon!
        </p>
        <button
          onClick={() => {
            setIsOrderPlaced(false);
            navigate("/home");
          }}
          className="mt-6 rounded-lg bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // 2. Agar cart sach mein empty hai (aur koi checkout nahi chal raha), toh Empty Cart screen dikhaein
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Your Cart is Empty 🛒</h1>
        <p className="mt-3 text-gray-500">
          Add some delicious food to your cart.
        </p>
      </div>
    );
  }

  return (
    <Checkout
      cartItems={cartItems}
      totalPrice={totalPrice}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      confirm={handleConfirmOrder}
    />
  );
}
