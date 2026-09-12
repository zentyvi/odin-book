import { useState } from "react";
import FocusLock from "react-focus-lock";
import { getFullName, makeStatus, useEscape } from "../../../utilis/helpers.js";
import Avatar from "../../../components/Avatar.jsx";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import { deleteChat } from "../../../api/functions/chats.js";
import { useData } from "../../../contexts/DataProvider.jsx";
import { useNavigate } from "react-router";

function ChatHeader({ chat }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();
  const { removeChatFromCache, findChat, settings } = useData();
  const { companion } = chat;
  const fullName = getFullName(companion);
  const navigate = useNavigate();
  const closeMenu = () => setIsMenuOpen(false);
  useEscape(() => setIsMenuOpen(false));

  const hasChat = Boolean(findChat(chat?.id));

  const handdleDelete = async () => {
    try {
      if (
        !confirm(
          `Are you sure taht you want to delete chat with ${fullName}, for both sides? `,
        )
      ) {
        return;
      }
      await deleteChat(companion?.username || companion?.id);
      removeChatFromCache(chat?.id);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const actionsMenu = (
    <FocusLock>
      <div onClick={closeMenu}>
        <div onClick={(e) => e.stopPropagation()}>
          <ul>
            <li>
              <button onClick={handdleDelete}>Delete chat</button>
            </li>
          </ul>
        </div>
      </div>
    </FocusLock>
  );

  return (
    <header>
      <div>
        <button
          onClick={() => openModal("USER_PREVIEW", companion)}
          aria-label="Open user's profile"
        >
          <Avatar user={companion} />

          <div>
            <h2>{fullName}</h2>
            <span>{makeStatus(companion, settings.is24h)}</span>
          </div>
        </button>
      </div>
      <div>
        <button
          disabled={!hasChat}
          aria-label="Actions menu"
          aria-pressed={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="bi bi-list" />
        </button>
        {isMenuOpen && actionsMenu}
      </div>
    </header>
  );
}

export default ChatHeader;
