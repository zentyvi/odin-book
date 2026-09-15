import { useRef, useState, useEffect } from "react";
import { formatNumber } from "../utilis/helpers.js";
import { useModal } from "../contexts/ModalProvider.jsx";
import { useAuth } from "../contexts/AuthProvider.jsx";
import styles from "../styles/components/LikeButton.module.css";

function LikeButton({ initialState = false, likesNumber = 0, onLike }) {
  const [likes, setLikes] = useState(likesNumber);
  const [isLiked, setIsLiked] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { sendNotification } = useModal();
  const likeButtonRef = useRef(null);

  /* Sync internal state if parent props change externally */
  useEffect(() => {
    // eslint-disable-next-line
    setLikes(likesNumber);
  }, [likesNumber]);

  useEffect(() => {
    // eslint-disable-next-line
    setIsLiked(initialState);
  }, [initialState]);

  const handleClick = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      sendNotification("Error", "Please log in first to send likes", "ERROR");
      return;
    }

    setIsLoading(true);
    try {
      const data = await onLike();
      if (data) {
        setIsLiked(data.isLiked);
        setLikes(data.likesCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["like-button"]}>
      <button
        ref={likeButtonRef}
        type="button"
        className={`${styles["like-button__btn"]} ${
          isLiked ? styles["like-button__btn--liked"] : ""
        } ${isLoading ? styles["like-button__btn--loading"] : ""}`}
        aria-label={isLiked ? "Unlike post" : "Like post"}
        aria-pressed={isLiked}
        onClick={handleClick}
        disabled={isLoading}
      >
        <i
          className={`${
            isLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"
          } ${styles["like-button__icon"]}`}
          aria-hidden="true"
        />
      </button>
      <span className={styles["like-button__count"]} aria-label="Likes number">
        {formatNumber(likes)}
      </span>
    </div>
  );
}

export default LikeButton;
