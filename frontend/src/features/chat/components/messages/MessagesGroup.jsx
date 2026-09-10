import Avatar from "../../../../components/Avatar.jsx";
import Message from "./Message.jsx";

function MessagesGroup({
  user,
  messages,
  onMessageDelete,
  openContextMenu,
  closeContextMenu,
  activeContextMenu,
}) {
  return (
    <li>
      <Avatar user={user} showStatus={false} />
      <ul>
        {messages.map((m) => (
          <Message
            message={m}
            onMessageDelete={onMessageDelete}
            openContextMenu={openContextMenu}
            closeContextMenu={closeContextMenu}
            key={m?.id || crypto.randomUUID()}
            activeContextMenu={activeContextMenu}
          />
        ))}
      </ul>
    </li>
  );
}

export default MessagesGroup;
