// import api from "./axios";
import { BASE_URL } from "./authApi";

export const getRestaurants = async () => {
  const response = await fetch(`${BASE_URL}restaurants/all-restaurant`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data.data;
};

export const getMenuItems = async () => {
  const response = await fetch(`${BASE_URL}restaurants/all-menuitem`);

  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  const data = await response.json();
  console.log(data);
  return data.data;
};

export const getDeals = async () => {
  const response = await fetch(`${BASE_URL}restaurants/all-deal`);

  if (!response.ok) {
    throw new Error("Failed to fetch deals");
  }

  const data = await response.json();
  return data.data;
};

export const getDealCategories = async () => {
  const response = await fetch(`${BASE_URL}restaurants/all-category`);

  if (!response.ok) {
    throw new Error("Failed to fetch deal categories");
  }

  const data = await response.json();
  return data.data || [];
};
