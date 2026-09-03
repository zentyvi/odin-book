import { api_url } from "../config.js";
import { getBearer } from "../../utilis/helpers.js";

async function createChat(userIdOrUsername) {
  const bearer = getBearer();

  const response = await fetch(`${api_url}/chats/${userIdOrUsername}/start`, {
    method: "POST",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to start chat");
  }

  const result = await response.json();
  return result;
}

export { createChat };
