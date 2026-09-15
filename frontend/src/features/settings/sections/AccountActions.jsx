import { deleteMyProfile } from "../../../api/functions/users.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";
import styles from "../../../styles/features/settings/AccountActions.module.css";

function AccountActions() {
  const { clearDataCache } = useData();
  const { logout } = useAuth();

  const handleDelete = async () => {
    try {
      if (
        !confirm(
          "Are you sure that you want to delete your profile? This action cannot be undone.",
        )
      ) {
        return;
      }
      await deleteMyProfile();
      clearDataCache();
      logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (!confirm("Are you sure that you want to log out?")) {
      return;
    }
    clearDataCache();
    logout();
  };

  return (
    <SettingsSection title="Account Actions">
      <div className={styles["account-actions"]}>
        <div className={styles["account-actions__item"]}>
          <button
            type="button"
            className={`${styles["account-actions__btn"]} ${styles["account-actions__btn--danger"]} btn btn--danger`}
            onClick={handleDelete}
          >
            Delete account
          </button>
        </div>
        <div className={styles["account-actions__item"]}>
          <button
            type="button"
            className={`${styles["account-actions__btn"]} btn btn--secondary`}
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}

export default AccountActions;
