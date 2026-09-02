import { deleteMyProfile } from "../../../api/functions/users.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";

function AccountActions() {
  const { logout } = useAuth();

  const handleDelete = async () => {
    try {
      if (
        !confirm(
          "Are you sure that you want to delete your profile? This action cannot be undone",
        )
      ) {
        return;
      }
      await deleteMyProfile();
      logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SettingsSection title="Account Actions">
      <div>
        <div>
          <button onClick={handleDelete}>Delete account</button>
        </div>
        <div>
          <button
            onClick={() => {
              if (!confirm("Are you sure that you want to log out?")) {
                return;
              }
              logout();
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}

export default AccountActions;
