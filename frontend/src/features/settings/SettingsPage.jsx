import { useState } from "react";
import { useData } from "../../contexts/DataProvider.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { updateLocalSettings } from "../../utilis/helpers.js";
import TimeAndFormat from "./sections/TimeAndFormat.jsx";
import PrivacyAndSecurity from "./sections/PrivacyAndSecurity.jsx";
import Appearance from "./sections/Appearance.jsx";
import AccountActions from "./sections/AccountActions.jsx";

function SettingsPage() {
  const { isAuthenticated } = useAuth();
  const { updateSettings } = useData();
  const [settingsToUpdate, setSettingsToUpdate] = useState({});

  const handleSave = async () => {
    try {
      if (isAuthenticated) {
        await updateSettings(settingsToUpdate);
      }
      updateLocalSettings(settingsToUpdate);
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
          <Appearance updateField={updateField} />
          <TimeAndFormat updateField={updateField} />
          {isAuthenticated && <PrivacyAndSecurity updateField={updateField} />}
        </div>
        <div>
          <button onClick={handleSave}>Save</button>
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
