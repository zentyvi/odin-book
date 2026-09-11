import Loader from "../../../../components/Loader.jsx";
import SidebarSection from "../../SidebarSection.jsx";
import Chat from "./Chat.jsx";

function Chats({ styles = {}, chats }) {
  const loading = typeof chats === "undefined";

  if (loading) {
    return <Loader />;
  }

  return (
    <SidebarSection title="Chats" styles={styles}>
      {chats?.length > 0 ? (
        chats.map((chat) => {
          // if a chat doesn't have an id, it means that a user doesn't have a chat with them
          if (!chat.id) return;

          return <Chat chat={chat} key={chat?.id || crypto.randomUUID()} />;
        })
      ) : (
        <li>
          <i>You don't have any chats yet.</i>
        </li>
      )}
    </SidebarSection>
  );
}

export default Chats;
