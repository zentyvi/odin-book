import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import CreatePostForm from "./CreatePostForm.jsx";
import { useTitle } from "../../utilis/helpers.js";

function CreatePostPage() {
  const { isAuthenticated } = useAuth();
  useTitle("Create post");

  return (
    <main>
      {isAuthenticated ? (
        <CreatePostForm />
      ) : (
        <div>
          <div>
            <h2>Please log in first</h2>
            <p>You need to log in first to create posts</p>
          </div>
          <div>
            <Link to="/auth/log-in" replace={true}>
              Log in
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default CreatePostPage;
