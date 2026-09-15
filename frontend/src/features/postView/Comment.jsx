import { useState } from "react";
import { Link } from "react-router";
import FocusLock from "react-focus-lock";
import { useData } from "../../contexts/DataProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import {
  getCalendarTime,
  getFullName,
  useEscape,
} from "../../utilis/helpers.js";
import { deleteComment, likeComment } from "../../api/functions/comments.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import LikeButton from "../../components/LikeButton.jsx";
import Avatar from "../../components/Avatar.jsx";
import styles from "../../styles/features/postView/Comment.module.css";

function Comment({ comment, postId, includeNavigation = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, likeCommentInCache, deleteCommentFromCache } = useData();
  const { openModal } = useModal();
  const { user } = useAuth();
  useEscape(() => setIsMenuOpen(false));

  const author = comment?.author;
  const isLiked = comment?.likedBy?.length > 0;
  const likesNumber = comment?._count?.likedBy || 0;
  const isMyComment = author?.id === user?.id;

  const handleLike = async () => {
    const result = await likeComment(comment.id);
    likeCommentInCache({ id: comment.id, ...result });
    return result;
  };

  /* Copy comment text to clipboard */
  const handleCopy = async () => {
    if (comment?.content) {
      await navigator.clipboard.writeText(comment.content);
    }
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

  const handleOpenProfile = () => {
    if (author) {
      openModal("USER_PREVIEW", author);
    }
  };

  /* Actions popup menu wrapped with FocusLock for keyboard accessibility */
  const actionsMenu = (
    <FocusLock returnFocus={true}>
      <div
        className={styles["comment__backdrop"]}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        id={`actions-menu-${comment?.id}`}
        className={styles["comment__dropdown"]}
      >
        <ul className={styles["comment__dropdown-list"]}>
          <li className={styles["comment__dropdown-item"]}>
            <button
              type="button"
              className={styles["comment__dropdown-btn"]}
              aria-label="Copy comment text"
              onClick={handleCopy}
            >
              <i className="bi bi-clipboard" aria-hidden="true" />
              Copy
            </button>
          </li>
          {includeNavigation && (
            <li className={styles["comment__dropdown-item"]}>
              <Link
                to={`/posts/${postId}`}
                className={styles["comment__dropdown-link"]}
              >
                <i className="bi bi-arrow-right" aria-hidden="true" />
                To post
              </Link>
            </li>
          )}
          {isMyComment && (
            <li className={styles["comment__dropdown-item"]}>
              <button
                type="button"
                className={`${styles["comment__dropdown-btn"]} ${styles["comment__dropdown-btn--danger"]}`}
                aria-label="Delete comment"
                onClick={handleDelete}
              >
                <i className="bi bi-trash" aria-hidden="true" />
                Delete
              </button>
            </li>
          )}
        </ul>
      </div>
    </FocusLock>
  );

  return (
    <li className={styles["comment"]}>
      <article className={styles["comment__article"]}>
        <div className={styles["comment__avatar"]}>
          <button
            type="button"
            className={styles["comment__author-btn"]}
            aria-label="Open author's profile"
            onClick={handleOpenProfile}
          >
            <Avatar user={author} showStatus={false} />
          </button>
        </div>

        <div className={styles["comment__content"]}>
          <header className={styles["comment__header"]}>
            <div className={styles["comment__author-info"]}>
              <button
                type="button"
                className={styles["comment__author-name-btn"]}
                aria-label="Open author's profile"
                onClick={handleOpenProfile}
              >
                <span className={styles["comment__author-name"]}>
                  {getFullName(author)}
                </span>
              </button>
              <span className={styles["comment__time"]}>
                {getCalendarTime(comment?.createdAt, settings?.is24h)}
              </span>
            </div>

            <div className={styles["comment__actions"]}>
              <LikeButton
                initialState={isLiked}
                likesNumber={likesNumber}
                onLike={handleLike}
              />

              <div className={styles["comment__menu-wrapper"]}>
                <button
                  type="button"
                  className={styles["comment__menu-btn"]}
                  aria-controls={`actions-menu-${comment?.id}`}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                  aria-label="Actions menu button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <i className="bi bi-three-dots" aria-hidden="true" />
                </button>
                {isMenuOpen && actionsMenu}
              </div>
            </div>
          </header>

          <div className={styles["comment__body"]}>
            <p className={styles["comment__text"]}>{comment?.content}</p>
          </div>
        </div>
      </article>
    </li>
  );
}

export default Comment;
