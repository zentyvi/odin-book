import { useState } from "react";
import { formatNumber } from "../utilis/helpers.js";

function LikeButton({ initialState, likesNumber, onLike }) {
  const [likes, setLikes] = useState(likesNumber);
  const [isLiked, setIsLiked] = useState(initialState);

  const onClick = async () => {
    try {
      onLike();
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button aria-label="Like button" onClick={onClick}>
        {isLiked ? (
          <i className="bi bi-hand-thumbs-up-fill" />
        ) : (
          <i className="bi bi-hand-thumbs-up" />
        )}
      </button>
      <span aria-label="Likes number">{formatNumber(likes)}</span>
    </div>
  );
}

export default LikeButton;
