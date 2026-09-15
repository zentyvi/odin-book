import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useTitle } from "../../utilis/helpers.js";
import EditFields from "./EditFields.jsx";
import EditHeader from "./EditHeader.jsx";
import styles from "../../styles/features/profileEdit/ProfileEditPage.module.css";

function ProfileEditPage() {
  const { isAuthenticated } = useAuth();
  useTitle("Edit profile");

  return (
    <main id="app-content">
      <div className="content-wrapper">
        <header className={styles["edit-page__header"]}>
          <h1 className={styles["edit-page__title"]}>Profile settings</h1>
        </header>

        {isAuthenticated ? (
          <div className={styles["edit-page__content"]}>
            <EditHeader />
            <EditFields />
          </div>
        ) : (
          <div className={styles["edit-page__unauthorized"]}>
            <div className={styles["edit-page__unauthorized-message"]}>
              <h2 className={styles["edit-page__unauthorized-title"]}>
                You are logged out
              </h2>
              <p className={styles["edit-page__unauthorized-text"]}>
                Please log in first to edit your profile.
              </p>
            </div>
            <div className={styles["edit-page__unauthorized-actions"]}>
              <Link
                to="/auth/log-in"
                className={`${styles["edit-page__login-btn"]} btn btn--primary`}
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProfileEditPage;
