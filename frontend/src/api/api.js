const API_URL = "http://localhost:5000";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
};

export const signupUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return await response.json();
};


export const getDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard`, {
    credentials: "include",
  });
  return await response.json();
};
