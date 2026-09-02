import { useRef, useState } from "react";
import { formatNumber } from "../utilis/helpers.js";
import { useModal } from "../contexts/ModalProvider.jsx";
import { useAuth } from "../contexts/AuthProvider.jsx";

function LikeButton({ initialState, likesNumber, onLike }) {
  const [likes, setLikes] = useState(likesNumber);
  const [isLiked, setIsLiked] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { sendNotification } = useModal();
  const likeButtonRef = useRef();

  const handleClick = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      sendNotification("Error", "Please log in first to send likes", "ERROR");
      const { current: button } = likeButtonRef;
      button.disabled = true;
      setTimeout(() => {
        button.disabled = false;
      }, 3000);
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

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <div>
      <button
        aria-label="Like button"
        onClick={handleClick}
        disabled={isLoading}
        ref={likeButtonRef}
      >
        <i
          className={
            isLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"
          }
        />
      </button>
      <span aria-label="Likes number">{formatNumber(likes)}</span>
    </div>
  );
}

export default LikeButton;
