import { useState } from "react";
import { useData } from "../../contexts/DataProvider.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import TimeAndFormat from "./sections/TimeAndFormat.jsx";
import PrivacyAndSecurity from "./sections/PrivacyAndSecurity.jsx";
import Appearance from "./sections/Appearance.jsx";
import AccountActions from "./sections/AccountActions.jsx";
import { useTitle } from "../../utilis/helpers.js";

function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const { updateSettings } = useData();
  const [settingsToUpdate, setSettingsToUpdate] = useState({});
  useTitle("Settings");

  const handleSave = async () => {
    try {
      await updateSettings(settingsToUpdate);
    } catch (err) {
      console.error(err);
    }
  };

  const updateField = (field, value) => {
    setSettingsToUpdate((prev) => {
      return { ...prev, [field]: value };
    });
  };

  return (
    <main>
      <header>
        <div>
          <h2>Settings</h2>
        </div>
      </header>
      <div>
        <div>
          <div>
            <Appearance updateField={updateField} />
            <TimeAndFormat updateField={updateField} />
            {isAuthenticated && (
              <PrivacyAndSecurity updateField={updateField} />
            )}
          </div>
          <div>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
        {isAuthenticated && (
          <div>
            <AccountActions />
          </div>
        )}
      </div>
    </main>
  );
}

export default SettingsPage;
