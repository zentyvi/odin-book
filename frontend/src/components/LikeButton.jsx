import { useState } from "react";
import { formatNumber } from "../utilis/helpers.js";

function LikeButton({ initialState, likesNumber, onLike }) {
  const [likes, setLikes] = useState(likesNumber);
  const [isLiked, setIsLiked] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

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
