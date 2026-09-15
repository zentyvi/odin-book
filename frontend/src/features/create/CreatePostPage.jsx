import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useTitle } from "../../utilis/helpers.js";
import CreatePostForm from "./CreatePostForm.jsx";
import styles from "../../styles/features/create/CreatePostPage.module.css";

function CreatePostPage() {
  const { isAuthenticated } = useAuth();
  useTitle("Create post");

  return (
    <main id="app-content" aria-labelledby="create-post-heading">
      <div className="content-wrapper">
        {isAuthenticated ? (
          <div className={styles["create-post-page__container"]}>
            <h1
              id="create-post-heading"
              className={styles["create-post-page__title"]}
            >
              Create New Post!
            </h1>
            <CreatePostForm />
          </div>
        ) : (
          /* Unauthorized prompt state */
          <div className={styles["create-post-page__unauth-card"]}>
            <div className={styles["create-post-page__unauth-header"]}>
              <i
                className={`bi bi-shield-lock ${styles["create-post-page__unauth-icon"]}`}
                aria-hidden="true"
              />
              <h1
                id="create-post-heading"
                className={styles["create-post-page__unauth-title"]}
              >
                Please log in first
              </h1>
              <p className={styles["create-post-page__unauth-text"]}>
                You need to be logged in to share posts with the community.
              </p>
            </div>
            <Link
              to="/auth/log-in"
              replace={true}
              className={`${styles["create-post-page__login-btn"]} btn btn--primary`}
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default CreatePostPage;
