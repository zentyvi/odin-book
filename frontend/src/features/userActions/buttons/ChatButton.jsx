import { useRef } from "react";
import { useNavigate } from "react-router";
import { getFullName } from "../../../utilis/helpers.js";

function ChatButton({ companion }) {
  const navigate = useNavigate();
  const buttonRef = useRef();

  const handleChat = async () => {
    const { current: button } = buttonRef;
    try {
      button.disabled = true;
      button.textContent = "Starting chat...";
      navigate(`/chats/${companion?.username || companion?.id}`);
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
