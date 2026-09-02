import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";

function PrivacyAndSecurity({ updateField }) {
  const { settings } = useData();
  const defaultValue = settings?.whoCanTextMe;

  const handleWhoCanText = (e) => {
    const { value } = e.target;
    updateField("whoCanTextMe", value);
  };

  return (
    <SettingsSection title="Privacy and Security">
      <div>
        <div>
          <label htmlFor="who-can-text-me">Who can text me</label>
        </div>
        <div>
          <select
            name="whoCanTextMe"
            id="who-can-text-me"
            defaultValue={defaultValue}
            onChange={handleWhoCanText}
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
