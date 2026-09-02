import { Link } from "react-router";
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import FormInput from "../../components/FormInput.jsx";
import { newComment } from "../../api/functions/posts.js";
import { useData } from "../../contexts/DataProvider.jsx";

const style = {};

function NewCommentForm({ postId }) {
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addCommentInCache } = useData();
  const buttonRef = useRef();

  const isButtonDisabled = comment.trim().length === 0 || loading;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      buttonRef.current.textContent = "Submiting...";
      const result = await newComment(postId, comment.trim());
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      setComment("");
      addCommentInCache({ postId, ...result, content: comment.trim() });
    } catch (err) {
      console.error(err);
    } finally {
      buttonRef.current.textContent = "Submit";
      setLoading(false);
    }
  };

  return (
    <div className={style["comments__form-wrapper"]}>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className={style["comments__form"]}>
          <FormInput
            disabled={loading}
            type="textarea"
            label="Add a comment"
            name="comment"
            id="comment"
            value={comment}
            placeholder="I really like this post because..."
            onChange={(e) => setComment(e.target.value)}
            isRequired={true}
            error={errors?.comment}
          />
          <div className={style["comments__submit-btn"]}>
            <button
              ref={buttonRef}
              type="submit"
              className="btn btn--primary"
              disabled={isButtonDisabled}
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className={style["comments__auth-prompt"]}>
          <p>You must log in to create comments.</p>
          <Link to="/log-in" className="btn btn--secondary">
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}

export default NewCommentForm;
