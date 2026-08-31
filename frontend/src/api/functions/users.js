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

async function getUserPreview(userId) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/users/${userId}/preview`, {
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

async function createFriendRequest(userId) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/users/${userId}/friend`, {
    method: "POST",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to send friend request");
  }

  const result = await response.json();
  return result;
}

async function getUserProfile(userId) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/users/${userId}`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user's profile");
  }

  const result = await response.json();
  return result;
}

async function handleRequestAction(requestId, action) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/users/me/requests/${requestId}`, {
    method: "POST",
    headers: {
      authorization: bearer,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    throw new Error("Failed to handle friend request");
  }

  const result = await response.json();
  return result;
}

export {
  getMyInfo,
  getUserPreview,
  createFriendRequest,
  getUserProfile,
  handleRequestAction,
};
