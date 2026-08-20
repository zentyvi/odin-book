import { GoogleLogin } from "@react-oauth/google";
import { googleLogIn } from "../api/functions/auth";
import { useAuth } from "../contexts/AuthProvider.jsx";

function GoogleLogInButton() {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogIn(credentialResponse);
      if (result?.token) {
        login(result.token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return <GoogleLogin type="icon" onSuccess={handleSuccess} />;
}

export default GoogleLogInButton;
