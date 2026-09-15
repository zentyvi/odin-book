import { Link } from "react-router";
import { getFullName, getCalendarTime } from "../../utilis/helpers.js";
import { likePost } from "../../api/functions/posts.js";
import { useData } from "../../contexts/DataProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import Avatar from "../../components/Avatar.jsx";
import LikeButton from "../../components/LikeButton.jsx";
import styles from "../../styles/features/postsFeed/PostCard.module.css";

function PostCard({ post }) {
  const author = post?.author;
  const isLiked = post?.likedBy?.length > 0;
  const likesNumber = post?._count?.likedBy || 0;
  const commentsNumber = post?._count?.comments || 0;
  const { likePostInCache, settings } = useData();
  const { openModal } = useModal();

  const handleLike = async () => {
    const result = await likePost(post.id);
    likePostInCache({ id: post.id, ...result });
    return result;
  };

  /* Open user modal preview instead of direct page navigation */
  const handleOpenProfile = () => {
    if (author) {
      openModal("USER_PREVIEW", author);
    }
  };

  return (
    <li className={styles["post-card"]}>
      <article className={styles["post-card__article"]}>
        <header className={styles["post-card__header"]}>
          <button
            type="button"
            className={styles["post-card__author-btn"]}
            aria-label="Open author's profile"
            onClick={handleOpenProfile}
          >
            <Avatar user={author} showStatus={false} />
          </button>

          <div className={styles["post-card__header-info"]}>
            <button
              type="button"
              className={styles["post-card__author-name-btn"]}
              aria-label="Open author's profile"
              onClick={handleOpenProfile}
            >
              <span className={styles["post-card__author-name"]}>
                {getFullName(author)}
              </span>
            </button>
            <span className={styles["post-card__time"]}>
              {getCalendarTime(post?.createdAt, settings?.is24h)}
            </span>
          </div>
        </header>

        <div className={styles["post-card__body"]}>
          <Link
            to={`/posts/${post.id}`}
            aria-label="To post"
            state={post}
            className={styles["post-card__content-link"]}
          >
            {post?.content && (
              <div className={styles["post-card__text-wrapper"]}>
                <p className={styles["post-card__text"]}>{post?.content}</p>
              </div>
            )}
            {post?.imageUrl && (
              <div className={styles["post-card__image-wrapper"]}>
                <img
                  src={post?.imageUrl}
                  alt="Post attachment"
                  className={styles["post-card__image"]}
                />
              </div>
            )}
          </Link>
        </div>

        <footer className={styles["post-card__footer"]}>
          <div className={styles["post-card__actions"]}>
            <LikeButton
              initialState={isLiked}
              likesNumber={likesNumber}
              onLike={handleLike}
            />

            <div className={styles["post-card__comments-wrapper"]}>
              <Link
                to={`/posts/${post.id}#comments`}
                aria-label="To comments"
                state={post}
                className={styles["post-card__comments-link"]}
              >
                <i className="bi bi-chat-fill" aria-hidden="true" />
                <span className={styles["post-card__comments-count"]}>
                  {commentsNumber}
                </span>
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </li>
  );
}

export default PostCard;
