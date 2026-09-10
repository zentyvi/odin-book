import { api_url } from "../config.js";
import { getBearer } from "../../utilis/helpers.js";

async function deleteMessage(messageId) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/messages/${messageId}`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete message");
  }

  const result = await response.json();
  return result;
}

export { deleteMessage };
