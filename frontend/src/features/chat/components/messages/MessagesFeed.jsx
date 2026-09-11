import { useState } from "react";
import Loader from "../../../../components/Loader.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import MessagesGroup from "./MessagesGroup.jsx";
import { useEscape } from "../../../../utilis/helpers.js";

function MessagesFeed({ messages, companion, onMessageDelete, ref }) {
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const { user } = useAuth();
  const loading = typeof messages === "undefined";
  const hasMessages = messages?.length > 0;
  const messagesToParse = [...messages];
  const messagesGroups = [];

  const openContextMenu = (messageId) => {
    setActiveContextMenu(messageId);
  };

  const closeContextMenu = () => {
    setActiveContextMenu(null);
  };

  useEscape(closeContextMenu);

  const makeGroup = (user, messages) => {
    return { user, messages, id: crypto.randomUUID() };
  };

  if (loading) {
    return <Loader />;
  }

  if (hasMessages) {
    let currentMessages = [];
    let lastAuthorId = null;

    messagesToParse.forEach((message, index) => {
      const currentAuthor = message.authorId === user?.id ? user : companion;

      if (lastAuthorId === null || message.authorId === lastAuthorId) {
        currentMessages.push(message);
      } else {
        const previousAuthor = lastAuthorId === user?.id ? user : companion;
        messagesGroups.push(makeGroup(previousAuthor, [...currentMessages]));

        currentMessages = [message];
      }

      if (index === messagesToParse.length - 1) {
        messagesGroups.push(makeGroup(currentAuthor, [...currentMessages]));
      }

      lastAuthorId = message.authorId;
    });
  }

  return (
    <div>
      {hasMessages ? (
        <ul>
          {messagesGroups.map((group) => (
            <MessagesGroup
              user={group.user}
              messages={group.messages}
              onMessageDelete={onMessageDelete}
              openContextMenu={openContextMenu}
              closeContextMenu={closeContextMenu}
              activeContextMenu={activeContextMenu}
              key={group.id}
            />
          ))}
        </ul>
      ) : (
        <div>
          <h3>You don't have any messages yet.</h3>
        </div>
      )}
      {/* Invisible anchor element for auto-scrolling */}
      <div ref={ref} />{" "}
    </div>
  );
}

export default MessagesFeed;
