import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import EditFields from "./EditFields.jsx";
import EditHeader from "./EditHeader.jsx";
import { useTitle } from "../../utilis/helpers.js";

function ProfileEditPage() {
  const { isAuthenticated } = useAuth();
  useTitle("Edit");

  return (
    <main>
      <header>
        <div>
          <h2>Profile settings</h2>
        </div>
      </header>
      <EditHeader />
      {isAuthenticated ? (
        <EditFields />
      ) : (
        <div>
          <div>
            <h3>You are logged out</h3>
            <p>Please log in first</p>
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

export default ProfileEditPage;
