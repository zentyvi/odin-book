import { useState } from "react";
import { useModal } from "../../contexts/ModalProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";
import { handleRequestAction } from "../../api/functions/users.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import Avatar from "../../components/Avatar.jsx";
import styles from "../../styles/features/profileView/FriendRequestItem.module.css";

function FriendRequestItem({ request, setUser }) {
  const { removeFriendReqestFromCache, addFriendToCache } = useAuth();
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const sender = request?.sender;
  const fullName = getFullName(sender);

  const handleModal = () => {
    openModal("USER_PREVIEW", sender);
  };

  const handleAction = async (action) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await handleRequestAction(request?.id, action);
      removeFriendReqestFromCache(request?.id);

      if (action === "ACCEPT") {
        addFriendToCache(sender);
      }

      setUser((prev) => {
        return {
          ...prev,
          _count: {
            ...prev._count,
            friends:
              action === "ACCEPT"
                ? result._count.friends
                : prev?._count?.friends,
          },
          receivedRequests: prev.receivedRequests.filter(
            (r) => r.id !== request.id,
          ),
        };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className={styles["request-card"]}>
      <div className={styles["request-card__user-info"]}>
        <button
          type="button"
          className={styles["request-card__avatar-btn"]}
          aria-label={`Open ${fullName}'s profile`}
          onClick={handleModal}
          disabled={isLoading}
        >
          <Avatar user={sender} className={styles["request-card__avatar"]} />
        </button>

        <div className={styles["request-card__details"]}>
          <button
            type="button"
            className={styles["request-card__name-btn"]}
            aria-label={`Open ${fullName}'s profile`}
            onClick={handleModal}
            disabled={isLoading}
          >
            <h4 className={styles["request-card__name"]}>{fullName}</h4>
            <span className={styles["request-card__username"]}>
              @{sender?.username}
            </span>
          </button>
        </div>
      </div>

      <div className={styles["request-card__actions"]}>
        <button
          type="button"
          className={`${styles["request-card__action-btn"]} ${styles["request-card__action-btn--accept"]}`}
          aria-label="Accept friend request"
          onClick={() => handleAction("ACCEPT")}
          disabled={isLoading}
        >
          <i className="bi bi-check-lg" />
        </button>
        <button
          type="button"
          className={`${styles["request-card__action-btn"]} ${styles["request-card__action-btn--reject"]}`}
          aria-label="Reject friend request"
          onClick={() => handleAction("REJECT")}
          disabled={isLoading}
        >
          <i className="bi bi-x-lg" />
        </button>
      </div>
    </li>
  );
}

export default FriendRequestItem;
