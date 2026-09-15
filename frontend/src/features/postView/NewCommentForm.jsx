import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { newComment } from "../../api/functions/posts.js";
import { useData } from "../../contexts/DataProvider.jsx";
import FormInput from "../../components/FormInput.jsx";
import styles from "../../styles/features/postView/NewCommentForm.module.css";

function NewCommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addCommentInCache } = useData();

  const isButtonDisabled = comment.trim().length === 0 || loading;

  /* Handle submit, update cache reactively, and clean up local form state */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    try {
      setLoading(true);
      setErrors(null);

      const trimmedComment = comment.trim();
      const result = await newComment(postId, trimmedComment);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      setComment("");
      addCommentInCache({ postId, ...result, content: trimmedComment });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
    if (errors) {
      setErrors(null);
    }
  };

  return (
    <div className={styles["comment-form-wrapper"]}>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className={styles["comment-form"]}>
          <FormInput
            disabled={loading}
            type="textarea"
            label="Write a comment"
            name="comment"
            id="comment"
            value={comment}
            placeholder="I really like this post because..."
            onChange={handleInputChange}
            isRequired={true}
            error={errors?.comment}
          />
          <div className={styles["comment-form__actions"]}>
            <button
              type="submit"
              className={`${styles["comment-form__submit-btn"]} btn btn--primary`}
              disabled={isButtonDisabled}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles["comment-form__auth-prompt"]}>
          <p className={styles["comment-form__auth-text"]}>
            You must log in to create comments.
          </p>
          <Link to="/log-in" className="btn btn--secondary">
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}

export default NewCommentForm;
