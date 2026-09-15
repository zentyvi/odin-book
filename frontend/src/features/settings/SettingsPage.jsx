import { useState } from "react";
import { useData } from "../../contexts/DataProvider.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useTitle } from "../../utilis/helpers.js";
import TimeAndFormat from "./sections/TimeAndFormat.jsx";
import PrivacyAndSecurity from "./sections/PrivacyAndSecurity.jsx";
import Appearance from "./sections/Appearance.jsx";
import AccountActions from "./sections/AccountActions.jsx";
import styles from "../../styles/features/settings/SettingsPage.module.css";

function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const { updateSettings } = useData();
  const [settingsToUpdate, setSettingsToUpdate] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  useTitle("Settings");

  const hasChanges = Object.keys(settingsToUpdate).length > 0;

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;

    try {
      setIsSaving(true);
      await updateSettings(settingsToUpdate);
      setSettingsToUpdate({});
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettingsToUpdate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main id="app-content" aria-labelledby="settings-heading">
      <div className="content-wrapper">
        <header className={styles["settings-page__header"]}>
          <h1 id="settings-heading" className={styles["settings-page__title"]}>
            Settings
          </h1>
        </header>

        <div className={styles["settings-page__content"]}>
          <div className={styles["settings-page__main-section"]}>
            <div className={styles["settings-page__sections-list"]}>
              <Appearance updateField={updateField} />
              <TimeAndFormat updateField={updateField} />
              {isAuthenticated && (
                <PrivacyAndSecurity updateField={updateField} />
              )}
            </div>

            <div className={styles["settings-page__actions"]}>
              <button
                type="button"
                className={`${styles["settings-page__save-btn"]} btn btn--primary`}
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

          {isAuthenticated && (
            <aside className={styles["settings-page__danger-zone"]}>
              <AccountActions />
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;
