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
        chats.map((chat) => <Chat chat={chat} key={chat?.id} />)
      ) : (
        <li>
          <i>You don't have any chats yet.</i>
        </li>
      )}
    </SidebarSection>
  );
}

export default Chats;
