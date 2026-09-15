import { useRef } from "react";
import { Link } from "react-router";
import { getFullName } from "../../../utilis/helpers.js";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import { useAuth } from "../../../contexts/AuthProvider.jsx";

function ChatButton({ companion, className = "" }) {
  const { isAuthenticated } = useAuth();
  const { closeModal, sendNotification } = useModal();
  const buttonRef = useRef();

  const handleChat = async (e) => {
    const { current: button } = buttonRef;
    try {
      if (!isAuthenticated) {
        e.preventDefault();
        sendNotification("Error", "Please log in first to chat", "ERROR");
        return;
      }

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
    <Link
      to={`/chats/${companion?.username || companion?.id}`}
      aria-label={`To chat with ${getFullName(companion)}`}
      onClick={handleChat}
      ref={buttonRef}
      className={`btn btn--secondary ${className}`}
    >
      Chat
    </Link>
  );
}
export default ChatButton;
