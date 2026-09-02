import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createPost } from "../../api/functions/posts.js";
import { validatePost } from "../../utilis/validators.js";
import FormInput from "../../components/FormInput.jsx";

function CreatePostForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const imagePreview = image ? URL.createObjectURL(image) : null;

  const fromatedContent = content?.trim();
  const isDisabled = (!fromatedContent && !image) || errors?.content;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("postImage", image);
      formData.append("content", fromatedContent);

      const result = await createPost(formData);
      if (result?.errors) {
        setErrors(result.errors);
        return;
      }
      setErrors(null);
      navigate(`/posts/${result.id}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setImage(file);
    setErrors((prev) => {
      return { ...prev, postImage: null };
    });
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <header>
        <h2>Create new post!</h2>
      </header>
      <form onSubmit={handleSubmit}>
        <FormInput
          type="textarea"
          rows={30}
          label="Content"
          id="post-content"
          value={content}
          onChange={(e) => validatePost(e, setContent, setErrors)}
          error={errors?.content}
        />
        {imagePreview && (
          <div>
            <div>
              <img src={imagePreview} alt="Preview image" />
              <button
                aria-label="Remove attachment"
                onClick={() => setImage(null)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            {errors?.postImage && (
              <div>
                <span>{errors?.postImage?.msg}</span>
              </div>
            )}
          </div>
        )}
        <div>
          <div>
            <button disabled={isDisabled} type="submit">
              Create
            </button>
          </div>
          <div>
            <button
              aria-label="Attach photo"
              type="button"
              onClick={handleTriggerFileInput}
            >
              <i className="bi bi-paperclip" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;
