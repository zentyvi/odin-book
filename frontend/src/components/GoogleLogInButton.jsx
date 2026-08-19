import { GoogleLogin } from "@react-oauth/google";
import { googleLogIn } from "../api/functions/auth";
import { useNavigate } from "react-router";

function GoogleLogInButton() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogIn(credentialResponse);
      if (result?.token) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return <GoogleLogin type="icon" onSuccess={handleSuccess} />;
}

export default GoogleLogInButton;
