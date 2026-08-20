import { api_url } from "../config.js";

async function getMyInfo() {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/users/me`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user's data");
  }

  const result = await response.json();
  return result;
}

export { getMyInfo };
