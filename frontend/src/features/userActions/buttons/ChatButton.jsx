import { useRef } from "react";
import { createChat } from "../../../api/functions/chats.js";
import { getFullName } from "../../../utilis/helpers.js";

function ChatButton({ companion }) {
  const buttonRef = useRef();

  const handleChat = async () => {
    const { current: button } = buttonRef;
    try {
      button.disabled = true;
      button.textContent = "Starting chat...";
      const result = await createChat(companion?.id || companion?.username);
      console.log(result);
    } catch (err) {
      button.textContent = "Error has occured";
      setTimeout(() => {
        button.disabled = false;
        button.textContent = "Chat";
      }, 3000);
      console.error(err);
    }
  };

  return (
    <li>
      <button
        aria-label={`To chat with ${getFullName(companion)}`}
        onClick={handleChat}
        ref={buttonRef}
      >
        Chat
      </button>
    </li>
  );
}
export default ChatButton;
