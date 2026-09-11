import { useState } from "react";
import Loader from "../../../../components/Loader.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import MessagesGroup from "./MessagesGroup.jsx";
import {
  checkIfSameDay,
  createDateMessage,
  useEscape,
} from "../../../../utilis/helpers.js";

function MessagesFeed({ messages, companion, onMessageDelete }) {
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const { user } = useAuth();
  const loading = typeof messages === "undefined";
  const hasMessages = messages?.length > 0;
  const messagesToParse = [...messages];
  const parsedMessages = [];

  const openContextMenu = (messageId) => {
    setActiveContextMenu(messageId);
  };

  const closeContextMenu = () => {
    setActiveContextMenu(null);
  };

  useEscape(closeContextMenu);

  const makeGroup = (user, messages) => {
    return {
      id: crypto.randomUUID(),
      type: "GROUP",
      group: { user, messages, id: crypto.randomUUID() },
    };
  };

  const makeDateMessage = (date) => {
    return {
      id: crypto.randomUUID(),
      type: "DATE",
      content: createDateMessage(date),
    };
  };

  if (loading) {
    return <Loader />;
  }

  if (hasMessages) {
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
    <div>
      {hasMessages ? (
        <ul>
          {parsedMessages.map((message) => {
            if (message?.type === "GROUP") {
              const { group } = message;
              return (
                <MessagesGroup
                  key={message.id}
                  user={group.user}
                  messages={group.messages}
                  onMessageDelete={onMessageDelete}
                  openContextMenu={openContextMenu}
                  closeContextMenu={closeContextMenu}
                  activeContextMenu={activeContextMenu}
                />
              );
            } else if (message?.type === "DATE") {
              return (
                <li key={message?.id}>
                  <span>{message?.content}</span>
                </li>
              );
            }
          })}
        </ul>
      ) : (
        <div>
          <h3>You don't have any messages yet.</h3>
        </div>
      )}
    </div>
  );
}

export default MessagesFeed;
