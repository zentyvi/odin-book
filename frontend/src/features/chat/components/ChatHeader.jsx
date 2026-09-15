import { useState } from "react";
import { useNavigate } from "react-router";
import FocusLock from "react-focus-lock";
import { getFullName, makeStatus, useEscape } from "../../../utilis/helpers.js";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import { deleteChat } from "../../../api/functions/chats.js";
import { useData } from "../../../contexts/DataProvider.jsx";
import Avatar from "../../../components/Avatar.jsx";
import styles from "../../../styles/features/chat/ChatHeader.module.css";

function ChatHeader({ chat }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useModal();
  const { removeChatFromCache, findChat, settings } = useData();
  const { companion } = chat;
  const fullName = getFullName(companion);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);
  useEscape(closeMenu);

  const hasChat = Boolean(findChat(chat?.id));

  const handleDelete = async () => {
    try {
      if (
        !confirm(
          `Are you sure that you want to delete chat with ${fullName}, for both sides?`,
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
    <FocusLock returnFocus>
      <div
        className={styles["chat-header__backdrop"]}
        onClick={closeMenu}
      ></div>

      <div
        className={styles["chat-header__menu"]}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className={styles["chat-header__menu-list"]}>
          <li className={styles["chat-header__menu-item"]}>
            <button
              type="button"
              className={styles["chat-header__menu-btn--danger"]}
              onClick={() => {
                closeMenu();
                handleDelete();
              }}
            >
              <i className="bi bi-trash" /> Delete chat
            </button>
          </li>
        </ul>
      </div>
    </FocusLock>
  );

  return (
    <header className={styles["chat-header"]}>
      <div className={styles["chat-header__user-info"]}>
        <button
          type="button"
          className={styles["chat-header__profile-btn"]}
          onClick={() => openModal("USER_PREVIEW", companion)}
          aria-label="Open user's profile"
        >
          <Avatar user={companion} className={styles["chat-header__avatar"]} />
          <div className={styles["chat-header__details"]}>
            <h2 className={styles["chat-header__name"]}>{fullName}</h2>
            <span
              className={`${styles["chat-header__status"]} ${companion?.isOnline ? styles["online"] : ""}`}
            >
              {makeStatus(companion, settings?.is24h)}
            </span>
          </div>
        </button>
      </div>

      <div className={styles["chat-header__actions"]}>
        <button
          type="button"
          disabled={!hasChat}
          aria-label="Actions menu"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          className={styles["chat-header__action-btn"]}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="bi bi-three-dots-vertical" />
        </button>
        {isMenuOpen && actionsMenu}
      </div>
    </header>
  );
}

export default ChatHeader;
