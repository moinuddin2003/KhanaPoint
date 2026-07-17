import { BASE_URL } from "./authApi";


const getHeaders = () => {
  const token = sessionStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    // Django REST Framework JWT typically uses Bearer or JWT prefix
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const cartApi = {
  // 1. GET: Fetch current cart items
  getCart: async () => {
    const response = await fetch(`${BASE_URL}order/cart/`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  },

  // 2. POST: Add item to cart
  addToCart: async (menuItemId, dealId = null) => {
    const payload = {
      menu_item_id: menuItemId,
      deal_id: dealId,
    };

    const response = await fetch(`${BASE_URL}order/cart/add/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to add item to cart");
    return response.json();
  },

  // 3. PATCH: Update item quantity
  updateItemQuantity: async (itemId, quantity) => {
    const response = await fetch(
      `${BASE_URL}order/cart/update-item/${itemId}/`,
      {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      },
    );
    if (!response.ok) throw new Error("Failed to update item quantity");
    return response.json();
  },

  // 4. DELETE: Remove item from cart
  deleteItem: async (itemId) => {
    const response = await fetch(
      `${BASE_URL}order/cart/delete-item/${itemId}/`,
      {
        method: "DELETE",
        headers: getHeaders(),
      },
    );
    if (!response.ok) throw new Error("Failed to delete item from cart");
    return response;
  },

  // 5. POST: Complete Checkout / Place Order
  checkout: async (checkoutData) => {
    const response = await fetch(`${BASE_URL}order/checkout/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(checkoutData),
    });
    if (!response.ok) throw new Error("Failed to place order");
    return response.json();
  },

  // 6. GET: Get order details (Tracking)
  getOrderDetails: async (orderId) => {
    const response = await fetch(`${BASE_URL}order/order/${orderId}/`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch order details");
    return response.json();
  },
};
