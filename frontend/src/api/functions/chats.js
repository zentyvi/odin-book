import { api_url } from "../config.js";
import { getBearer } from "../../utilis/helpers.js";

async function getChat(companion_id_or_username) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/chats/${companion_id_or_username}`, {
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

async function sendMessage(companion_id_or_username, message) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/chats/${companion_id_or_username}`, {
    method: "POST",
    headers: {
      authorization: bearer,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const result = await response.json();
  return result;
}

async function deleteChat(companion_id_or_username) {
  const bearer = getBearer();
  const response = await fetch(`${api_url}/chats/${companion_id_or_username}`, {
    method: "DELETE",
    headers: {
      authorization: bearer,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }

  const result = await response.json();
  return result;
}

async function markChatAsRead(companion_id_or_username) {
  const bearer = getBearer();
  const response = await fetch(
    `${api_url}/chats/${companion_id_or_username}/read`,
    {
      method: "PUT",
      headers: {
        authorization: bearer,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }

  const result = await response.json();
  return result;
}

export { getChat, sendMessage, deleteChat, markChatAsRead };
