import { BASE_URL } from "./authApi";

/**
 * Same idea as cartApi.js's getHeaders(), but checks BOTH storages.
 * Reason: LoginForm.jsx saves the token to localStorage when "Remember Me"
 * is checked, and to sessionStorage otherwise. The old getHeaders() in
 * cartApi.js only checked sessionStorage, so logged-in admins who checked
 * "Remember Me" would silently send no Authorization header. This checks
 * both so it works either way.
 */
const getToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

const jsonHeaders = () => {
  const token = getToken();
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// For endpoints that take an image file we must send FormData and let the
// browser set the multipart Content-Type header itself (with the boundary).
// So this one deliberately does NOT set Content-Type.
const formHeaders = () => {
  const token = getToken();
  const headers = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

/**
 * Wraps fetch + throws a readable error with whatever message the backend
 * sent back, instead of a generic "Failed to fetch".
 */
async function request(url, options) {
  const response = await fetch(url, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    // some endpoints (e.g. DELETE) may return an empty body - that's fine
  }
  if (!response.ok) {
    const message =
      body?.message || body?.detail || JSON.stringify(body) || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

/** Turns a plain object into FormData, skipping null/undefined/empty-string
 *  values (so PATCH requests don't overwrite fields you didn't touch, and
 *  so you don't need to re-upload an image just to edit the price). */
function toFormData(fields) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    fd.append(key, value);
  });
  return fd;
}

/* ------------------------------------------------------------------ */
/*  ANALYTICS                                                          */
/* ------------------------------------------------------------------ */

export const analyticsApi = {
  overview: () =>
    request(`${BASE_URL}/order/admin/analytics/overview/`, { headers: jsonHeaders() }),

  ordersByStatus: () =>
    request(`${BASE_URL}/order/admin/analytics/orders-by-status/`, { headers: jsonHeaders() }),

  popularDeals: () =>
    request(`${BASE_URL}/order/admin/analytics/popular-deals/`, { headers: jsonHeaders() }),

  popularItems: () =>
    request(`${BASE_URL}/order/admin/analytics/popular-items/`, { headers: jsonHeaders() }),

  revenueByRestaurant: () =>
    request(`${BASE_URL}/order/admin/analytics/revenue-by-restaurant/`, { headers: jsonHeaders() }),

  revenueOverTime: () =>
    request(`${BASE_URL}/order/admin/analytics/revenue-over-time/`, { headers: jsonHeaders() }),
};

/* ------------------------------------------------------------------ */
/*  ORDERS                                                             */
/* ------------------------------------------------------------------ */

export const ordersApi = {
  getAll: () => request(`${BASE_URL}/order/admin/orders`, { headers: jsonHeaders() }),

  updateStatus: (orderId, status) =>
    request(`${BASE_URL}/order/admin/orders/${orderId}/status/`, {
      method: "PATCH",
      headers: jsonHeaders(),
      body: JSON.stringify({ status }),
    }),
};

/* ------------------------------------------------------------------ */
/*  CATEGORIES  (no image field assumed - adjust if your serializer differs) */
/* ------------------------------------------------------------------ */

export const categoriesApi = {
  getAll: () => request(`${BASE_URL}/restaurants/all-category`, { headers: jsonHeaders() }),

  getOne: (catId) =>
    request(`${BASE_URL}/restaurants/category/${catId}`, { headers: jsonHeaders() }),

  create: (data) =>
    request(`${BASE_URL}/restaurants/create-category/`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(data), // e.g. { name: "Pizza" }
    }),

  update: (catId, data) =>
    request(`${BASE_URL}/restaurants/update-category/${catId}/`, {
      method: "PATCH",
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }),

  remove: (catId) =>
    request(`${BASE_URL}/restaurants/delete-category/${catId}/`, {
      method: "DELETE",
      headers: jsonHeaders(),
    }),
};

/* ------------------------------------------------------------------ */
/*  RESTAURANTS  (has an image, so uses FormData)                      */
/* ------------------------------------------------------------------ */

export const restaurantsApi = {
  getAll: () => request(`${BASE_URL}restaurants/all-restaurant`, { headers: jsonHeaders() }),

  getOne: (restId) =>
    request(`${BASE_URL}/restaurants/restaurant/${restId}`, { headers: jsonHeaders() }),

  // fields example: { name, description, address, image (File) }
  create: (fields) =>
    request(`${BASE_URL}/restaurants/create-restaurant/`, {
      method: "POST",
      headers: formHeaders(),
      body: toFormData(fields),
    }),

  update: (restId, fields) =>
    request(`${BASE_URL}restaurants/update-restaurant/${restId}/`, {
      method: "PATCH",
      headers: formHeaders(),
      body: toFormData(fields),
    }),

  remove: (restId) =>
    request(`${BASE_URL}restaurants/delete-restaurant/${restId}/`, {
      method: "DELETE",
      headers: jsonHeaders(),
    }),
};

/* ------------------------------------------------------------------ */
/*  MENU ITEMS  (has an image, so uses FormData)                       */
/* ------------------------------------------------------------------ */

export const menuItemsApi = {
  getAll: () => request(`${BASE_URL}restaurants/all-menuitem`, { headers: jsonHeaders() }),

  getOne: (menuId) =>
    request(`${BASE_URL}restaurants/menuitem/${menuId}`, { headers: jsonHeaders() }),

  // fields example: { name, description, price, category, restaurant, image (File) }
  create: (fields) =>
    request(`${BASE_URL}restaurants/create-menuitem/`, {
      method: "POST",
      headers: formHeaders(),
      body: toFormData(fields),
    }),

  update: (menuId, fields) =>
    request(`${BASE_URL}restaurants/update-menuitem/${menuId}/`, {
      method: "PATCH",
      headers: formHeaders(),
      body: toFormData(fields),
    }),

  remove: (menuId) =>
    request(`${BASE_URL}/restaurants/delete-menuitem/${menuId}/`, {
      method: "DELETE",
      headers: jsonHeaders(),
    }),
};

/* ------------------------------------------------------------------ */
/*  DEALS  (has an image, so uses FormData)                            */
/* ------------------------------------------------------------------ */

export const dealsApi = {
  getAll: () => request(`${BASE_URL}/restaurants/all-deal`, { headers: jsonHeaders() }),

  getOne: (dealId) =>
    request(`${BASE_URL}/restaurants/deal/${dealId}/`, { headers: jsonHeaders() }),

  // fields example: { name, combo_price, image (File) }
  create: (fields) =>
    request(`${BASE_URL}/restaurants/create-deal/`, {
      method: "POST",
      headers: formHeaders(),
      body: toFormData(fields),
    }),

  update: (dealId, fields) =>
    request(`${BASE_URL}/restaurants/update-deal/${dealId}/`, {
      method: "PATCH",
      headers: formHeaders(),
      body: toFormData(fields),
    }),

  remove: (dealId) =>
    request(`${BASE_URL}/restaurants/delete-deal/${dealId}/`, {
      method: "DELETE",
      headers: jsonHeaders(),
    }),
};

/* ------------------------------------------------------------------ */
/*  DEAL ITEMS  (links a menu item to a deal - no image assumed)       */
/* ------------------------------------------------------------------ */

export const dealItemsApi = {
  getAll: () => request(`${BASE_URL}/restaurants/all-deal-item/`, { headers: jsonHeaders() }),

  getOne: (itemId) =>
    request(`${BASE_URL}/restaurants/deal-item/${itemId}/`, { headers: jsonHeaders() }),

  // fields example: { deal, menu_item, quantity }
  create: (data) =>
    request(`${BASE_URL}/restaurants/create-deal-item/`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }),

  update: (itemId, data) =>
    request(`${BASE_URL}/restaurants/update-deal-item/${itemId}/`, {
      method: "PATCH",
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    }),

  remove: (itemId) =>
    request(`${BASE_URL}/restaurants/delete-deal-item/${itemId}/`, {
      method: "DELETE",
      headers: jsonHeaders(),
    }),
};
