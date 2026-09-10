import { useRef } from "react";
import { Link } from "react-router";
import { getFullName } from "../../../utilis/helpers.js";
import { useModal } from "../../../contexts/ModalProvider.jsx";

function ChatButton({ companion }) {
  const { closeModal } = useModal();
  const buttonRef = useRef();

  const handleChat = async () => {
    const { current: button } = buttonRef;
    try {
      button.disabled = true;
      button.textContent = "Starting chat...";
      closeModal();
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
      <Link
        to={`/chats/${companion?.username || companion?.id}`}
        replace={true}
        aria-label={`To chat with ${getFullName(companion)}`}
        onClick={handleChat}
        ref={buttonRef}
      >
        Chat
      </Link>
    </li>
  );
}
export default ChatButton;
