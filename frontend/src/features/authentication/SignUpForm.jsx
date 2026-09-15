import { useState } from "react";
import { Link } from "react-router";
import { signUp } from "../../api/functions/auth.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import FormInput from "../../components/FormInput.jsx";
import GoogleLogInButton from "../../components/GoogleLogInButton.jsx";
import GitHubLogInButton from "../../components/GithubLogInButton.jsx";
import {
  validateFirstName,
  validateLastName,
  validateUsername,
  validatePassword,
} from "../../utilis/validators.js";
import { useTitle } from "../../utilis/helpers.js";
import styles from "../../styles/features/authentication/LogInForm.module.css";

function SignUpForm() {
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, continueAsGuest } = useAuth();

  useTitle("Sign up");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = {
        firstName,
        lastName: lastName.trim().length > 0 ? lastName.trim() : null,
        username,
        password,
      };

      const result = await signUp(data);
      if (result?.errors) {
        setErrors(result.errors);
      } else if (result?.token) {
        login(result.token);
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const hasFormErrors = Boolean(
    errors?.firstName ||
    errors?.lastName ||
    errors?.username ||
    errors?.password,
  );

  return (
    <main className={styles["auth-container"]}>
      <div className={styles["auth-card"]}>
        <header className={styles["auth-card__header"]}>
          <h1 className={styles["auth-card__title"]}>Sign up</h1>
          <p className={styles["auth-card__subtitle"]}>
            Already have an account?{" "}
            <Link to="/auth/log-in" className={styles["auth-card__link"]}>
              Log in
            </Link>
            .
            <br /> Or continue as a{" "}
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
              value={firstName}
              onChange={(e) => validateFirstName(e, setFirstName, setErrors)}
              id="firstName"
              label="First name"
              placeholder="John"
              isRequired={true}
              error={errors?.firstName}
            />

            <FormInput
              value={lastName}
              onChange={(e) => validateLastName(e, setLastName, setErrors)}
              id="lastName"
              label="Last name"
              placeholder="Doe (optional)"
              isRequired={false}
              error={errors?.lastName}
            />

            <FormInput
              value={username}
              onChange={(e) => validateUsername(e, setUsername, setErrors)}
              id="username"
              label="Username"
              placeholder="JohnDoe"
              isRequired={true}
              error={errors?.username}
              subTitle="Can contain letters and numbers"
            />

            <FormInput
              type="password"
              value={password}
              onChange={(e) => validatePassword(e, setPassword, setErrors)}
              id="password"
              label="Password"
              isRequired={true}
              error={errors?.password}
              placeholder="••••••••"
              subTitle="Please use at least 6 characters"
            />
          </div>

          <div className={styles["auth-form__actions"]}>
            <button
              type="submit"
              className={styles["auth-form__submit-btn"]}
              disabled={isLoading || hasFormErrors}
            >
              {isLoading ? "Creating account..." : "Submit"}
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

export default SignUpForm;
