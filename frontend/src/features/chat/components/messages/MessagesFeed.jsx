import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import {
  checkIfSameDay,
  createDateMessage,
  useEscape,
} from "../../../../utilis/helpers.js";
import MessagesGroup from "./MessagesGroup.jsx";
import Loader from "../../../../components/Loader.jsx";
import styles from "../../../../styles/features/chat/messages/MessagesFeed.module.css";

function MessagesFeed({ messages, companion, onMessageDelete }) {
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const { user } = useAuth();
  const loading = typeof messages === "undefined";
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  const messagesFeedRef = useRef(null);

  const openContextMenu = (messageId) => {
    setActiveContextMenu(messageId);
  };

  const closeContextMenu = () => {
    setActiveContextMenu(null);
  };

  useEscape(closeContextMenu);

  const makeGroup = (author, groupMessages) => {
    const isOutgoing = user?.id === author?.id;
    return {
      id: crypto.randomUUID(),
      type: "GROUP",
      group: { user: author, messages: groupMessages, isOutgoing },
    };
  };

  const makeDateMessage = (date) => {
    return {
      id: crypto.randomUUID(),
      type: "DATE",
      content: createDateMessage(date),
    };
  };

  /* Automatically scroll to the latest message when messages update */
  useEffect(() => {
    if (messagesFeedRef.current) {
      messagesFeedRef.current.scrollTo({
        top: messagesFeedRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages?.length]);

  if (loading) {
    return (
      <div className={styles["messages-feed__loader"]}>
        <Loader />
      </div>
    );
  }

  const parsedMessages = [];

  if (hasMessages) {
    const messagesToParse = [...messages];
    let currentGroup = [];
    let currentGroupAuthorId = null;
    let lastDate = null;

    messagesToParse.forEach((message, index) => {
      const currentDate = new Date(message?.createdAt);
      const isNewDay =
        lastDate === null || !checkIfSameDay(lastDate, currentDate);
      const isDifferentAuthor =
        currentGroupAuthorId !== null &&
        message.authorId !== currentGroupAuthorId;

      if (isNewDay) {
        if (currentGroup.length > 0) {
          const author = currentGroupAuthorId === user?.id ? user : companion;
          parsedMessages.push(makeGroup(author, currentGroup));
          currentGroup = [];
        }

        parsedMessages.push(makeDateMessage(currentDate));
        lastDate = currentDate;
      } else if (isDifferentAuthor) {
        const author = currentGroupAuthorId === user?.id ? user : companion;
        parsedMessages.push(makeGroup(author, currentGroup));
        currentGroup = [];
      }

      currentGroup.push(message);
      currentGroupAuthorId = message.authorId;

      if (index === messagesToParse.length - 1 && currentGroup.length > 0) {
        const author = currentGroupAuthorId === user?.id ? user : companion;
        parsedMessages.push(makeGroup(author, currentGroup));
      }
    });
  }

  return (
    <div className={styles["messages-feed"]} ref={messagesFeedRef}>
      {hasMessages ? (
        <ul className={styles["messages-feed__list"]}>
          {parsedMessages.map((part) => {
            if (part?.type === "GROUP") {
              const { group } = part;
              return (
                <MessagesGroup
                  key={part.id}
                  user={group.user}
                  messages={group.messages}
                  onMessageDelete={onMessageDelete}
                  openContextMenu={openContextMenu}
                  closeContextMenu={closeContextMenu}
                  activeContextMenu={activeContextMenu}
                  isOutgoing={group?.isOutgoing}
                  messagesFeedRef={messagesFeedRef}
                />
              );
            }

            if (part?.type === "DATE") {
              return (
                <li
                  key={part.id}
                  className={styles["messages-feed__date-item"]}
                >
                  <span className={styles["messages-feed__date-badge"]}>
                    {part.content}
                  </span>
                </li>
              );
            }

            return null;
          })}
        </ul>
      ) : (
        <div className={styles["messages-feed__empty"]}>
          <h3>You don't have any messages yet.</h3>
        </div>
      )}
    </div>
  );
}

export default MessagesFeed;
