import Comment from "./Comment.jsx";
import NewCommentForm from "./NewCommentForm.jsx";
import Loader from "../../components/Loader.jsx";
import styles from "../../styles/features/postView/PostComments.module.css";

function PostComments({ comments, postId }) {
  const loading = typeof comments === "undefined";

  if (loading) return <Loader className={styles["comments__loader"]} />;

  return (
    <section className={styles["comments"]} aria-labelledby="comments">
      <header className={styles["comments__header"]}>
        <div className={styles["comments__title-group"]}>
          <h2 id="comments" className={styles["comments__title"]}>
            Comments
          </h2>
          <span className={styles["comments__count"]}>
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </header>

      <div className={styles["comments__form-section"]}>
        <NewCommentForm postId={postId} />
      </div>

      {comments.length > 0 ? (
        <div className={styles["comments__list-wrapper"]}>
          <ul className={styles["comments__list"]}>
            {comments.map((c) => (
              <Comment comment={c} postId={postId} key={c.id} />
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles["comments__empty"]}>
          <h3 className={styles["comments__empty-title"]}>There is nothing</h3>
          <p className={styles["comments__empty-text"]}>Be the first!</p>
        </div>
      )}
    </section>
  );
}

export default PostComments;
