import { useData } from "../../../contexts/DataProvider.jsx";
import SettingsSection from "../SettingsSection.jsx";

function Appearance({ updateField }) {
  const { settings } = useData();
  const defaultValue = settings?.theme;

  const handleTheme = (e) => {
    const { value } = e.target;
    updateField("theme", value);
  };

  return (
    <SettingsSection title="Appearance">
      <div>
        <div>
          <label htmlFor="theme">Theme</label>
        </div>
        <div>
          <select
            name="theme"
            id="theme"
            defaultValue={defaultValue}
            onChange={handleTheme}
          >
            <option value="DEFAULT">Default</option>
            <option value="FRIENDS">Friends</option>
          </select>
        </div>
      </div>
    </SettingsSection>
  );
}

export default Appearance;
