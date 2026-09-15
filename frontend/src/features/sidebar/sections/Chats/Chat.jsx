import { Link } from "react-router";
import Avatar from "../../../../components/Avatar.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import {
  getCalendarTime,
  getFullName,
  getShortTime,
} from "../../../../utilis/helpers.js";
import { useData } from "../../../../contexts/DataProvider.jsx";
import styles from "../../../../styles/features/sidebar/sections/chats/Chat.module.css";

function Chat({ chat, onItemClick }) {
  const { user } = useAuth();
  const { settings } = useData();
  const { companion, messages, unreadMessages } = chat;

  const lastMessage =
    Array.isArray(messages) && messages.length > 0
      ? messages[messages.length - 1]
      : null;

  const isRead = lastMessage?.isRead;
  const isMyMessage = lastMessage?.authorId === user?.id;
  const hasImage = Boolean(lastMessage?.imageUrl);
  const hasContent = Boolean(lastMessage?.content);

  const previewMessage = (
    <span className={styles["chat__preview-text"]}>
      {hasImage && (
        <span
          className={styles["chat__image-icon"]}
          aria-label="Attached image"
        >
          <i className="bi bi-image" aria-hidden="true" /> Photo
        </span>
      )}
      {hasContent && (
        <span aria-label="Last message">{lastMessage?.content}</span>
      )}
    </span>
  );

  return (
    <li className={styles["chat-item"]}>
      <Link
        to={`/chats/${companion?.username || companion?.id}`}
        className={styles["chat__link"]}
        onClick={onItemClick}
      >
        <Avatar
          user={companion}
          showStatus={true}
          className={styles["chat__avatar"]}
        />
        <div className={styles["chat__info"]}>
          <div className={styles["chat__header"]}>
            <h3 className={styles["chat__name"]}>{getFullName(companion)}</h3>
            {lastMessage && (
              <div className={styles["chat__meta"]}>
                {isMyMessage && (
                  <span className={styles["chat__status-icon"]}>
                    {isRead ? (
                      <i className="bi bi-check-all" aria-label="Read" />
                    ) : (
                      <i className="bi bi-check" aria-label="Sent" />
                    )}
                  </span>
                )}
                <span
                  className={styles["chat__time"]}
                  title={getCalendarTime(
                    lastMessage?.createdAt,
                    settings?.is24h,
                  )}
                >
                  {getShortTime(lastMessage?.createdAt, settings?.is24h)}
                </span>
              </div>
            )}
          </div>
          <div className={styles["chat__body"]}>
            {hasContent || hasImage ? (
              <>
                {previewMessage}
                {unreadMessages > 0 && (
                  <span
                    className={styles["chat__badge"]}
                    aria-label="Unread messages number"
                  >
                    {unreadMessages > 99 ? "99+" : unreadMessages}
                  </span>
                )}
              </>
            ) : (
              <span className={styles["chat__empty"]}>No messages yet</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default Chat;
