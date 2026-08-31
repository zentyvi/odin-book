import { useState } from "react";
import FormInput from "../../components/FormInput.jsx";
import { createPost } from "../../api/functions/posts.js";
import { useNavigate } from "react-router";

function CreatePostPage() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const isDisabled = content?.trim()?.length === 0;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await createPost(content.trim());
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
            onChange={(e) => setContent(e.target.value)}
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
