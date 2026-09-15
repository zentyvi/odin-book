import FocusLock from "react-focus-lock";
import { getCalendarTime, getShortTime } from "../../../../utilis/helpers.js";
import { useData } from "../../../../contexts/DataProvider.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import styles from "../../../../styles/features/chat/messages/Message.module.css";
import { useState } from "react";

function Message({
  onMessageDelete,
  openContextMenu,
  closeContextMenu,
  activeContextMenu,
  message,
  messagesFeedRef,
}) {
  const [cordinates, setCordinates] = useState({
    left: 0,
    top: 0,
    overflow: false,
  });
  const { settings } = useData();
  const { user } = useAuth();
  const { isRead } = message;
  const isMyMessage = message?.authorId === user?.id;
  const isContextMenuOpen = activeContextMenu === message?.id;

  const handleCopy = async () => {
    if (message?.content) {
      await navigator.clipboard.writeText(message.content);
    }
    closeContextMenu();
  };

  const handleDelete = async () => {
    try {
      if (
        !confirm(
          "Are you sure that you want to delete this message for both sides?",
        )
      ) {
        return;
      }
      closeContextMenu();
      await onMessageDelete(message.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMenu = (e) => {
    if (isContextMenuOpen) {
      closeContextMenu();
      return;
    }
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const messagesFeed = messagesFeedRef?.current;

    const left = e.clientX - rect.left;
    const top = e.clientY - rect.top;

    let overflow = false;

    const messageHeight = rect.height;

    if (messagesFeed) {
      const feedRect = messagesFeed.getBoundingClientRect();

      const clickYRelativeToFeed = e.clientY - feedRect.top;

      const feedHeight = feedRect.height;
      overflow =
        feedHeight - clickYRelativeToFeed <
        messageHeight + messageHeight * 0.25;
    }

    setCordinates({ left, top, overflow });
    openContextMenu(message.id);
  };

  const actionsMenu = (
    <FocusLock>
      <div
        className={styles["message__backdrop"]}
        onClick={closeContextMenu}
        onContextMenu={(e) => {
          e.preventDefault();
          closeContextMenu();
        }}
      />
      <div
        className={`${styles["message__menu"]} ${cordinates?.overflow ? styles["overflow"] : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          left: cordinates?.left,
          top: cordinates?.top,
        }}
      >
        <ul className={styles["message__menu-list"]}>
          {message?.content && (
            <li className={styles["message__menu-item"]}>
              <button
                type="button"
                className={styles["message__menu-btn"]}
                onClick={handleCopy}
              >
                <i className="bi bi-clipboard" /> Copy text
              </button>
            </li>
          )}
          <li className={styles["message__menu-item"]}>
            <button
              type="button"
              className={styles["message__menu-btn--danger"]}
              onClick={handleDelete}
            >
              <i className="bi bi-trash" /> Delete message
            </button>
          </li>
        </ul>
      </div>
    </FocusLock>
  );

  return (
    <li
      className={`${styles["message"]} ${
        isMyMessage ? styles["message--outgoing"] : styles["message--incoming"]
      }`}
    >
      <div
        className={styles["message__bubble"]}
        onContextMenu={handleOpenMenu}
        onClick={handleOpenMenu}
      >
        {message?.imageUrl && (
          <div className={styles["message__image-wrapper"]}>
            <img
              src={message.imageUrl}
              alt="Attachment"
              className={styles["message__image"]}
              loading="lazy"
            />
          </div>
        )}

        {message?.content && (
          <p className={styles["message__text"]}>{message.content}</p>
        )}

        <div className={styles["message__meta"]}>
          <span
            className={styles["message__time"]}
            title={getCalendarTime(message?.createdAt, settings?.is24h)}
          >
            {getShortTime(message?.createdAt, settings?.is24h)}
          </span>

          {isMyMessage && (
            <span className={styles["message__status"]}>
              {isRead ? (
                <i className="bi bi-check-all" aria-label="Read" />
              ) : (
                <i className="bi bi-check" aria-label="Sent" />
              )}
            </span>
          )}
        </div>
        {isContextMenuOpen && actionsMenu}
      </div>
    </li>
  );
}

export default Message;
