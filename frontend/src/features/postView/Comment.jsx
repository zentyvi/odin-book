import { useData } from "../../contexts/DataProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import {
  getCalendarTime,
  getFullName,
  useEscape,
} from "../../utilis/helpers.js";
import { deleteComment, likeComment } from "../../api/functions/comments.js";
import Avatar from "../../components/Avatar.jsx";
import LikeButton from "../../components/LikeButton.jsx";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { Link } from "react-router";

function Comment({ comment, postId, includeNavigation = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, likeCommentInCache, deleteCommentFromCache } = useData();
  const { openModal } = useModal();
  const { user } = useAuth();
  useEscape(() => setIsMenuOpen(false));

  const author = comment?.author;
  const isLiked = comment?.likedBy?.length > 0;
  const likesNumber = comment?._count?.likedBy;
  const isMyComment = author?.id === user?.id;

  const handleLike = async () => {
    const result = await likeComment(comment.id);
    likeCommentInCache({ id: comment.id, ...result });
    return result;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(comment.content);
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    try {
      if (!confirm("Are you sure that you want to delete this comment?")) {
        return;
      }
      await deleteComment(comment?.id);
      setIsMenuOpen(false);
      deleteCommentFromCache(comment?.postId || postId, comment?.id);
    } catch (err) {
      console.error(err);
    }
  };

  const actionsMenu = (
    <div id={`actions-menu-${comment?.id}`}>
      <div>
        <ul>
          <li>
            <button aria-label="Copy comment" onClick={handleCopy}>
              Copy
            </button>
          </li>
          {isMyComment && (
            <li>
              <button aria-label="Delete comment" onClick={handleDelete}>
                Delete
              </button>
            </li>
          )}
          {includeNavigation && (
            <li>
              <Link to={`/posts/${postId}`} replace={true}>
                To post
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <li>
      <header>
        <button
          aria-label="open author's profile"
          onClick={() => openModal("USER_PREVIEW", author)}
        >
          <Avatar user={author} showStatus={false} />
        </button>
        <div>
          <div>
            <button
              aria-label="open author's profile"
              onClick={() => openModal("USER_PREVIEW", author)}
            >
              <span>{getFullName(author)}</span>
            </button>
            <span>{getCalendarTime(comment?.createdAt, settings?.is24h)}</span>
          </div>
        </div>
        <LikeButton
          initialState={isLiked}
          likesNumber={likesNumber}
          onLike={handleLike}
        />
        <div>
          <button
            aria-controls={`actions-menu-${comment?.id}`}
            aria-expanded={isMenuOpen}
            aria-label="Actions menu buttin"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="bi bi-list" />
          </button>
          {isMenuOpen && actionsMenu}
        </div>
      </header>
      <main>
        <p>{comment?.content}</p>
      </main>
    </li>
  );
}

export default Comment;
