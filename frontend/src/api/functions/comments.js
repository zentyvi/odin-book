import { getBearer } from "../../utilis/helpers.js";
import { api_url } from "../config.js";

async function likeComment(commentId) {
  const bearer = getBearer();
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
  const bearer = getBearer();
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
