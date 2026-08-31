import { api_url } from "../config.js";

async function likeComment(commentId) {
  const token = localStorage.getItem("token");
  if (!token) {
    return { isLiked: false };
  }

  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/comments/${commentId}/like`, {
    method: "POST",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to like comment");
  }

  const result = await response.json();
  return result;
}

async function deleteComment(commentId) {
  const token = localStorage.getItem("token");

  const bearer = `Bearer ${token}`;
  const response = await fetch(`${api_url}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  const result = await response.json();
  return result;
}

export { likeComment, deleteComment };
