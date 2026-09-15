import { useModal } from "../contexts/ModalProvider.jsx";
import { getFullName } from "../utilis/helpers.js";
import Avatar from "./Avatar.jsx";
import ChatButton from "../features/userActions/buttons/ChatButton.jsx";
import styles from "../styles/components/UserCard.module.css";

function UserCard({ user }) {
  const { openModal } = useModal();
  const fullName = getFullName(user) || "Unknown User";
  const username = user?.username ? `@${user.username}` : "";

  const handleOpenProfile = () => {
    if (user) {
      openModal("USER_PREVIEW", user);
    }
  };

  return (
    <article className={styles["user-card"]}>
      <button
        type="button"
        className={styles["user-card__profile-btn"]}
        aria-label={`Open ${fullName}'s profile`}
        onClick={handleOpenProfile}
      >
        <Avatar user={user} showStatus={true} />
        <div className={styles["user-card__info"]}>
          <span className={styles["user-card__name"]}>{fullName}</span>
          {username && (
            <span className={styles["user-card__username"]}>{username}</span>
          )}
        </div>
      </button>

      <div className={styles["user-card__actions"]}>
        <ChatButton
          companion={user}
          className={`${styles["user-card__action-btn"]} btn btn--secondary`}
        />
        <button
          type="button"
          className={`${styles["user-card__action-btn"]} btn btn--primary`}
          onClick={handleOpenProfile}
        >
          Profile
        </button>
      </div>
    </article>
  );
}

export default UserCard;
