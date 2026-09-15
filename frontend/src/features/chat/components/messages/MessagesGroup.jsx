import Avatar from "../../../../components/Avatar.jsx";
import Message from "./Message.jsx";
import styles from "../../../../styles/features/chat/messages/MessagesGroup.module.css";

function MessagesGroup({
  user,
  messages,
  onMessageDelete,
  openContextMenu,
  closeContextMenu,
  activeContextMenu,
  isOutgoing,
  messagesFeedRef,
}) {
  const groupModifier = isOutgoing
    ? styles["messages-group--outgoing"]
    : styles["messages-group--incoming"];

  return (
    <li className={`${styles["messages-group"]} ${groupModifier}`}>
      <div className={styles["messages-group__avatar-wrapper"]}>
        <Avatar
          user={user}
          showStatus={false}
          className={styles["messages-group__avatar"]}
        />
      </div>
      <ul className={styles["messages-group__list"]}>
        {messages.map((m) => (
          <Message
            message={m}
            onMessageDelete={onMessageDelete}
            openContextMenu={openContextMenu}
            closeContextMenu={closeContextMenu}
            activeContextMenu={activeContextMenu}
            messagesFeedRef={messagesFeedRef}
            key={m?.id || crypto.randomUUID()}
          />
        ))}
      </ul>
    </li>
  );
}

export default MessagesGroup;
