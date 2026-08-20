import { api_url } from "../config.js";

async function getFeed() {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/posts`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts feed");
  }

  const result = await response.json();
  return result;
}

async function likePost(postId) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/posts/${postId}/like`, {
    method: "POST",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to like post");
  }

  const result = await response.json();
  return result;
}

export { getFeed, likePost };
