import Loader from "../../../../components/Loader.jsx";
import SidebarSection from "../../SidebarSection.jsx";
import Chat from "./Chat.jsx";
import styles from "../../../../styles/features/sidebar/sections/chats/Chat.module.css";

function Chats({ chats, onItemClick }) {
  const loading = typeof chats === "undefined";

  if (loading) {
    return <Loader />;
  }

  return (
    <SidebarSection title="Chats">
      {chats?.length > 0 ? (
        chats.map((chat) => {
          // if a chat doesn't have an id, it means that a user doesn't have a chat with them
          if (!chat.id) return;

          return (
            <Chat
              chat={chat}
              key={chat?.id || crypto.randomUUID()}
              onItemClick={onItemClick}
            />
          );
        })
      ) : (
        <li className={styles["chat-item--default"]}>
          <i className="bi bi-patch-question" aria-hidden={true} />
          <i>You don't have any chats yet.</i>
        </li>
      )}
    </SidebarSection>
  );
}

export default Chats;
