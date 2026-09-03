import { useState } from "react";
import { Link } from "react-router";
import { logIn } from "../../api/functions/auth";
import FormInput from "../../components/FormInput";
import GoogleLogInButton from "../../components/GoogleLogInButton";
import GitHubLogInButton from "../../components/GithubLogInButton";
import { useAuth } from "../../contexts/AuthProvider";
import { useTitle } from "../../utilis/helpers.js";
const styles = {};

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

      if (result.errors) {
        setErrors(result.errors);
      } else {
        login(result.token, null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles["auth-container"]}>
      <title>Log in | Odin Book</title>
      <div className={styles["auth-card"]}>
        <header className={styles["auth-card__header"]}>
          <h2 className={styles["auth-card__title"]}>Log in</h2>
          <p className={styles["auth-card__subtitle"]}>
            Don't have an account yet?{" "}
            <Link
              to="/auth/sign-up"
              replace={true}
              className={styles["auth-card__link"]}
            >
              Sign up
            </Link>
            . Or continue as a{" "}
            <Link to="/" replace={true} onClick={continueAsGuest}>
              guest
            </Link>
            .
          </p>
        </header>

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
        <div>
          <GoogleLogInButton />
          <GitHubLogInButton />
        </div>
      </div>
    </main>
  );
}

export default LogInForm;
