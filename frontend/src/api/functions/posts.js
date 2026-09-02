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

async function getSinglePost(postId) {
  const token = localStorage.getItem("token");
  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/posts/${postId}`, {
    method: "GET",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch post's data");
  }

  const result = await response.json();
  return result;
}

async function likePost(postId) {
  const token = localStorage.getItem("token");
  if (!token) {
    return { isLiked: false };
  }

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

async function newComment(postId, comment) {
  const token = localStorage.getItem("token");

  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/posts/${postId}/comment`, {
    method: "POST",
    headers: {
      authorization: bearer,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Failed to create comment");
  }

  const result = await response.json();
  return result;
}

async function createPost(formData) {
  const token = localStorage.getItem("token");

  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/posts`, {
    method: "POST",
    headers: {
      authorization: bearer,
    },
    body: formData,
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Failed to create post");
  }

  const result = await response.json();
  return result;
}

async function deletePost(postId) {
  const token = localStorage.getItem("token");

  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok && response.status !== 400) {
    throw new Error("Failed to delete post");
  }

  const result = await response.json();
  return result;
}

export { getFeed, likePost, getSinglePost, newComment, createPost, deletePost };
