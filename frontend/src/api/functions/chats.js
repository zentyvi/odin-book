import { api_url } from "../config.js";
import { getBearer } from "../../utilis/helpers.js";

async function getChat(userIdOrUsername) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/chats/${userIdOrUsername}`, {
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get chat");
  }

  const result = await response.json();
  return result;
}

export { getChat };
