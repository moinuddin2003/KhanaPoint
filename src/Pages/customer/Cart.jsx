import { useState } from "react";
import Checkout from "../../Components/cart/Checkout";
import { useEffect } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const handleIncrease = (id) => {
    const updatedCart = cartItems.map((cart) => {
      if (cart.id === id) {
        return {
          ...cart,
          quantity: cart.quantity + 1,
        };
      }
      return cart;
    });

    setCartItems(updatedCart);
    localStorage.setItem("UserCart", JSON.stringify(updatedCart));
  };

  const handleDecrease = (id) => {
    let updatedCart;
    const findCartItems = cartItems.find((item) => item.id === id);
    if (findCartItems.quantity > 1) {
      updatedCart = cartItems.map((cart) => {
        if (cart.id === id) {
          return {
            ...cart,
            quantity: cart.quantity - 1,
          };
        }
        return cart;
      });
    } else {
      const isConfirmed = window.confirm(
        "Are you sure you want to remove this item?",
      );

      if (!isConfirmed) {
        return;
      } else {
        updatedCart = cartItems.filter((item) => item.id !== id);
      }
    }

    setCartItems(updatedCart);
    localStorage.setItem("UserCart", JSON.stringify(updatedCart));
    // }
  };
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("UserCart")) || [];
    console.log(storedCart);
    setCartItems(storedCart);
  }, []);
  return (
    <Checkout
      cartItems={cartItems}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
    />
  );
}
