import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";
import styles from "../../../styles/features/settings/SettingsRow.module.css";

function TimeAndFormat({ updateField }) {
  const { settings } = useData();
  const is24h = settings?.is24h;

  const handleHours = (e) => {
    const { value } = e.target;
    const is24hValue = Boolean(Number(value));
    updateField("is24h", is24hValue);
  };

  return (
    <SettingsSection title="Time and Format">
      <div className={styles["row"]}>
        <div className={styles["label-container"]}>
          <label htmlFor="time-format" className={styles["label"]}>
            Time Format
          </label>
        </div>
        <div className={styles["select-container"]}>
          <select
            name="is24h"
            id="time-format"
            defaultValue={is24h ? "1" : "0"}
            onChange={handleHours}
            className={styles["select"]}
          >
            <option value="0">12-Hour</option>
            <option value="1">24-Hour</option>
          </select>
        </div>
      </div>
    </SettingsSection>
  );
}

export default TimeAndFormat;
