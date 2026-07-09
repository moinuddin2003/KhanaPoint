const BASE_URL = "http://127.0.0.1:8000";

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
