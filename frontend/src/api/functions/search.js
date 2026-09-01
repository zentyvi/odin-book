import { api_url } from "../config.js";

async function searchUsers(query, abortConroller = null) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/search/users?query=${query}`, {
    headers: {
      authorization: bearer,
    },
    signal: abortConroller?.signal,
  });

  if (!response.ok) {
    throw new Error("Error during searching users");
  }

  const result = await response.json();
  return result;
}

export { searchUsers };
