export const BASE_URL = import.meta.env.VITE_API_BASE_URL;



// const RAW_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://foodappbackend-production-5f7c.up.railway.app";
// export const BASE_URL = RAW_URL.replace(/\/+$/, "");

// // 1. Dynamic Image Helper Function
// export const getImageUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http") || path.startsWith("/src")) return path;

//   // Ensure path starts with a single slash
//   const cleanPath = path.startsWith("/") ? path : `/${path}`;
//   return `${BASE_URL}${cleanPath}`;
// };
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/user/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  console.log(response);

  const data = await response.json();

  return data;
};

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/user/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  console.log(response);

  const data = await response.json();

  return data;
};
