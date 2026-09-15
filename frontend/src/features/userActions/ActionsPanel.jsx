import ChatButton from "./buttons/ChatButton.jsx";
import FreindRequestButton from "./buttons/FriendRequestButton.jsx";
import styles from "../../styles/features/userActions/ActionsPanel.module.css";

function ActionsPanel({ companion, setCompanion, children, className = "" }) {
  return (
    <ul
      aria-label="Actions panel"
      className={`${styles["actions-panel"]} ${className}`}
    >
      <li>
        <FreindRequestButton
          companion={companion}
          setCompanion={setCompanion}
        />
      </li>
      <li>
        <ChatButton companion={companion} />
      </li>
      {children}
    </ul>
  );
}

export default ActionsPanel;
