import ChatButton from "./buttons/ChatButton.jsx";
import FreindRequestButton from "./buttons/FriendRequestButton.jsx";

function ActionsPanel({ companion, setCompanion, children }) {
  return (
    <ul aria-label="Actions panel">
      <ChatButton companion={companion} />
      <FreindRequestButton companion={companion} setCompanion={setCompanion} />
      {children}
    </ul>
  );
}

export default ActionsPanel;
