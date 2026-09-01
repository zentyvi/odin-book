import { useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import { createPost } from "../../api/functions/posts.js";
import { useNavigate } from "react-router";

function CreatePostPage() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const fromatedContent = content?.trim();
  const isDisabled = fromatedContent?.length === 0 || errors;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await createPost(fromatedContent);
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

  const handleChange = (e) => {
    const { value } = e.target;
    setContent(value);

    const formated = value.trim();
    if (formated.length > 1000) {
      setErrors((prev) => {
        return {
          ...prev,
          content: { msg: "Content cannot exceed 1000 characters" },
        };
      });
      return;
    }
    if (value.length > 0 && formated.length === 0) {
      setErrors((prev) => {
        return {
          ...prev,
          content: { msg: "Content cannot be blank" },
        };
      });
      return;
    }
    setErrors(null);
  };

  return (
    <main>
      <header>
        <h2>Create new post!</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            isRequired={true}
            type="textarea"
            rows={30}
            value={content}
            onChange={handleChange}
            error={errors?.content}
          />
          <div>
            <button disabled={isDisabled} type="submit">
              Create
            </button>
          </div>
        </form>
      </header>
    </main>
  );
}

export default CreatePostPage;
