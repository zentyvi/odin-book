import { useState } from "react";
import { Link } from "react-router";
import { logIn } from "../../api/functions/auth";
import FormInput from "../../components/FormInput";
import GoogleLogInButton from "../../components/GoogleLogInButton";
import GitHubLogInButton from "../../components/GithubLogInButton";
import { useAuth } from "../../contexts/AuthProvider";
import { useTitle } from "../../utilis/helpers.js";
import styles from "../../styles/features/authentication/LogInForm.module.css";

function LogInForm() {
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, continueAsGuest } = useAuth();

  useTitle("Log in");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrors({});

      const data = { username, password };
      const result = await logIn(data);

      if (result?.errors) {
        setErrors(result.errors);
      } else if (result?.token) {
        login(result.token, null);
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles["auth-container"]}>
      <div className={styles["auth-card"]}>
        <header className={styles["auth-card__header"]}>
          <h1 className={styles["auth-card__title"]}>Log in</h1>
          <p className={styles["auth-card__subtitle"]}>
            Don't have an account yet?{" "}
            <Link to="/auth/sign-up" className={styles["auth-card__link"]}>
              Sign up
            </Link>
            <br />. Or continue as a{" "}
            <Link
              to="/"
              onClick={continueAsGuest}
              className={styles["auth-card__link"]}
            >
              guest
            </Link>
            .
          </p>
        </header>

        {errors.general && (
          <div className={styles["auth-card__error-banner"]}>
            {errors.general}
          </div>
        )}

        <form className={styles["auth-form"]} onSubmit={handleSubmit}>
          <div className={styles["auth-form__fields"]}>
            <FormInput
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: null }));
                }
              }}
              id="username"
              label="Username"
              placeholder="JohnDoe"
              isRequired={true}
              error={errors?.username}
            />

            <FormInput
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: null }));
                }
              }}
              id="password"
              label="Password"
              isRequired={true}
              placeholder="••••••••"
              error={errors?.password}
            />
          </div>

          <div className={styles["auth-form__actions"]}>
            <button
              type="submit"
              className={styles["auth-form__submit-btn"]}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Submit"}
            </button>
          </div>
        </form>

        <div className={styles["auth-card__divider"]}>
          <span>OR</span>
        </div>

        <div className={styles["auth-card__oauth-group"]}>
          <GoogleLogInButton />
          <GitHubLogInButton />
        </div>
      </div>
    </main>
  );
}

export default LogInForm;
