import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";
import styles from "../../../styles/features/settings/SettingsRow.module.css";

function PrivacyAndSecurity({ updateField }) {
  const { settings } = useData();
  const whoCanTextMe = settings?.whoCanTextMe || "EVERYONE";

  const handleWhoCanText = (e) => {
    const { value } = e.target;
    updateField("whoCanTextMe", value);
  };

  return (
    <SettingsSection title="Privacy and Security">
      <div className={styles["row"]}>
        <div className={styles["label-container"]}>
          <label htmlFor="who-can-text-me" className={styles["label"]}>
            Who can text me
          </label>
        </div>
        <div className={styles["select-container"]}>
          <select
            name="whoCanTextMe"
            id="who-can-text-me"
            defaultValue={whoCanTextMe}
            onChange={handleWhoCanText}
            className={styles["select"]}
          >
            <option value="EVERYONE">Everyone</option>
            <option value="FRIENDS">Friends</option>
          </select>
        </div>
      </div>
    </SettingsSection>
  );
}

export default PrivacyAndSecurity;
