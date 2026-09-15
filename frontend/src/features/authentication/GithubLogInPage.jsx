import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { githubLogIn } from "../../api/functions/auth.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useTitle } from "../../utilis/helpers.js";
import Loader from "../../components/Loader.jsx";
import styles from "../../styles/features/authentication/GithubLogInPage.module.css";

function GithubLogInPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const [loading, setLoading] = useState(Boolean(code));
  const { login } = useAuth();

  useTitle(loading ? "Authenticating..." : "Authentication Error");

  useEffect(() => {
    if (!code) {
      return;
    }

    const handleGithubAuth = async () => {
      try {
        const result = await githubLogIn(code);
        if (result?.token) {
          login(result.token);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.error("GitHub Auth Error:", err);
      }
    };

    handleGithubAuth();
  }, [code, login]);

  if (loading) {
    return (
      <div className={styles["auth-redirect__loader"]}>
        <Loader />
      </div>
    );
  }

  return (
    <main className={styles["auth-redirect"]}>
      <div className={styles["auth-redirect__card"]}>
        <div className={styles["auth-redirect__header"]}>
          <i
            className={`bi bi-exclamation-triangle ${styles["auth-redirect__icon"]}`}
            aria-hidden="true"
          />
          <h2 className={styles["auth-redirect__title"]}>
            An error has occurred
          </h2>
          <p className={styles["auth-redirect__description"]}>
            The provided GitHub authorization code is invalid or expired. Please
            try logging in again.
          </p>
        </div>

        <div className={styles["auth-redirect__actions"]}>
          <Link to="/auth/log-in" className="btn btn--primary">
            Log in
          </Link>
          <Link to="/auth/sign-up" className="btn btn--secondary">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

export default GithubLogInPage;
