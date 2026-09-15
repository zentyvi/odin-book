import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";
import styles from "../../../styles/features/settings/SettingsRow.module.css";

function Appearance({ updateField }) {
  const { settings } = useData();
  const theme = settings?.theme || "DEFAULT";

  const handleTheme = (e) => {
    const { value } = e.target;
    updateField("theme", value);
  };

  return (
    <SettingsSection title="Appearance">
      <div className={styles["row"]}>
        <div className={styles["label-container"]}>
          <label htmlFor="theme" className={styles["label"]}>
            Theme
          </label>
        </div>
        <div className={styles["select-container"]}>
          <select
            name="theme"
            id="theme"
            defaultValue={theme}
            onChange={handleTheme}
            className={styles["select"]}
          >
            <option value="DEFAULT">Default</option>
          </select>
        </div>
      </div>
    </SettingsSection>
  );
}

export default Appearance;
