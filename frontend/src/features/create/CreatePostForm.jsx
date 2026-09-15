import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createPost } from "../../api/functions/posts.js";
import { validatePost } from "../../utilis/validators.js";
import FormInput from "../../components/FormInput.jsx";
import styles from "../../styles/features/create/CreatePostForm.module.css";

function CreatePostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const formattedContent = content?.trim();
  const isDisabled =
    (!formattedContent && !image) || errors?.content || loading;

  /* Cleanup object URL to prevent memory leaks */
  useEffect(() => {
    if (!image) {
      // eslint-disable-next-line
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    try {
      setLoading(true);
      const formData = new FormData();
      if (image) {
        formData.append("postImage", image);
      }
      formData.append("content", formattedContent);

      const result = await createPost(formData);
      if (result?.errors) {
        setErrors(result.errors);
        return;
      }
      setErrors(null);
      navigate(`/posts/${result.id}`, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setImage(file);
    setErrors((prev) => (prev ? { ...prev, postImage: null } : null));
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles["create-post-form-wrapper"]}>
      <form onSubmit={handleSubmit} className={styles["create-post-form"]}>
        <FormInput
          disabled={loading}
          type="textarea"
          rows={6}
          label="Content"
          id="post-content"
          value={content}
          placeholder="What's on your mind?"
          onChange={(e) => validatePost(e, setContent, setErrors)}
          error={errors?.content}
        />

        {imagePreview && (
          <div className={styles["create-post-form__preview-wrapper"]}>
            <div className={styles["create-post-form__preview-container"]}>
              <img
                src={imagePreview}
                alt="Selected attachment preview"
                className={styles["create-post-form__preview-img"]}
              />
              <button
                type="button"
                className={styles["create-post-form__remove-btn"]}
                aria-label="Remove attachment"
                onClick={handleRemoveImage}
                disabled={loading}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
            {errors?.postImage && (
              <span className={styles["create-post-form__error-msg"]}>
                {errors.postImage.msg}
              </span>
            )}
          </div>
        )}

        <div className={styles["create-post-form__actions"]}>
          <div className={styles["create-post-form__attach"]}>
            <button
              type="button"
              className={styles["create-post-form__attach-btn"]}
              aria-label="Attach photo"
              onClick={handleTriggerFileInput}
              disabled={loading}
            >
              <i className="bi bi-paperclip" aria-hidden="true" />
              <span className={styles["create-post-form__attach-text"]}>
                {image ? "Change image" : "Attach image"}
              </span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className={styles["create-post-form__file-input"]}
            />
          </div>

          <button
            type="submit"
            className={`${styles["create-post-form__submit-btn"]} btn btn--primary`}
            disabled={isDisabled}
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;
