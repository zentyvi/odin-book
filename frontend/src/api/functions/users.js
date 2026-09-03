import { getBearer } from "../../utilis/helpers.js";
import { api_url } from "../config.js";

async function getMyInfo() {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me`, {
    headers: {
      authorization: bearer,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result?.message || "Failed to fetch user's data");
    error.action = result?.action;
    error.status = response.status;
    throw error;
  }

  return result;
}

async function getMyFriends() {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/friends`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }

  const result = await response.json();
  return result;
}

async function getMySettings() {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/settings`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  const result = await response.json();
  return result;
}

async function getMyChats() {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/chats`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }

  const result = await response.json();
  return result;
}

async function updateMySettings(newSettings) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/settings`, {
    method: "PUT",
    headers: {
      authorization: bearer,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ settings: newSettings }),
  });

  if (!response.ok) {
    throw new Error("Failed to update settings");
  }

  const result = await response.json();
  return result;
}

async function updateMyProfile(data) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me`, {
    method: "PATCH",
    headers: {
      authorization: bearer,
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Failed update profile info");
  }

  const result = await response.json();
  return result;
}

async function uploadAvatar(formData) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/avatar`, {
    method: "PUT",
    headers: {
      authorization: bearer,
    },
    body: formData,
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Failed to upload avatar");
  }

  const result = await response.json();
  return result;
}

async function deleteAvatar() {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/avatar`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete avatar");
  }

  const result = await response.json();
  return result;
}

async function deleteMyProfile() {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  const result = await response.json();
  return result;
}

async function getUserPreview(userId) {
  const bearer = getBearer();
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

async function getUserProfile(userId) {
  const bearer = getBearer();
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

async function createFriendRequest(userId) {
  const bearer = getBearer();
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

async function handleRequestAction(requestId, action) {
  const bearer = getBearer();
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

async function deleteFriend(friendId) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/users/me/friends/${friendId}`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete friend");
  }

  const result = await response.json();
  return result;
}

export {
  getMyInfo,
  getMyFriends,
  getMySettings,
  getMyChats,
  updateMySettings,
  updateMyProfile,
  uploadAvatar,
  deleteAvatar,
  deleteMyProfile,
  getUserPreview,
  getUserProfile,
  createFriendRequest,
  handleRequestAction,
  deleteFriend,
};
