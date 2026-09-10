import ChatButton from "./buttons/ChatButton.jsx";
import FreindRequestButton from "./buttons/FriendRequestButton.jsx";

function ActionsPanel({ companion, setCompanion, children }) {
  return (
    <ul aria-label="Actions panel">
      <FreindRequestButton companion={companion} setCompanion={setCompanion} />
      <ChatButton companion={companion} />
      {children}
    </ul>
  );
}

export default ActionsPanel;
