import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";

function TimeAndFormat({ updateField }) {
  const { settings } = useData();
  const is24h = settings?.is24h;

  const handleHours = async (e) => {
    const { value } = e.target;
    const is24h = Boolean(Number(value));
    updateField("is24h", is24h);
  };

  return (
    <SettingsSection title="Time and Format">
      <div>
        <div>
          <label htmlFor="time-format">Format</label>
        </div>
        <div>
          <select
            name="is24h"
            id="time-format"
            defaultValue={is24h ? "1" : "0"}
            onChange={handleHours}
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
