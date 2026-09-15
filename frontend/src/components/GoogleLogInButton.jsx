import { GoogleLogin } from "@react-oauth/google";
import { googleLogIn } from "../api/functions/auth";
import { useAuth } from "../contexts/AuthProvider.jsx";
import styles from "../styles/components/GoogleLogInButton.module.css";

function GoogleLogInButton() {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogIn(credentialResponse);
      if (result?.token) {
        login(result.token);
      }
    } catch (err) {
      console.error("Google LogIn Error:", err);
    }
  };

  const handleError = () => {
    console.error("Google LogIn failed");
  };

  return (
    <div className={styles["google-btn-wrapper"]}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text="continue_with"
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
        height="100%"
      />
    </div>
  );
}

export default GoogleLogInButton;
