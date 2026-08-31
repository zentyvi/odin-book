import Loader from "../../components/Loader.jsx";
import Comment from "./Comment.jsx";
import NewCommentForm from "./NewCommentForm.jsx";

function PostComments({ comments, postId }) {
  const loading = typeof comments === "undefined";

  if (loading) return <Loader />;

  return (
    <section>
      <div>
        <h2 id="comments">Comments</h2>
        <a name="comments" />
        <span>
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>
      <NewCommentForm postId={postId} />
      {comments.length > 0 ? (
        <div>
          <ul>
            {comments.map((c) => (
              <Comment comment={c} postId={postId} key={c.id} />
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>There is nothing</h2>
          <p>Be the first!</p>
        </div>
      )}
    </section>
  );
}

export default PostComments;
