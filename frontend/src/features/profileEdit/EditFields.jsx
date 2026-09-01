import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import {
  validateFirstName,
  validateLastName,
  validateUsername,
  validatePassword,
} from "../../utilis/validators.js";
import { updateMyInfo } from "../../api/functions/users.js";
import EditModal from "./EditModal.jsx";
import { capitalizeFirstLetter } from "../../utilis/helpers.js";
const styles = {};

function EditFields() {
  const { user, setUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [errors, setErrors] = useState(null);

  const userType = user?.type;

  const handleSaveField = async (data) => {
    try {
      const result = await updateMyInfo(data);
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      setUser({ ...user, ...result.data });
      setEditingField(null);
      setErrors("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles["account-settings"]}>
      {/* Account Personal Info Section */}
      <section className={styles["account-settings__section"]}>
        <h3 className={styles["account-settings__section-title"]}>
          Account Info
        </h3>

        <div className={styles["account-settings__list"]}>
          {/* First Name */}
          <div className={styles["account-settings__item"]}>
            <div className={styles["account-settings__label-box"]}>
              <h4>First name</h4>
            </div>
            <div className={styles["account-settings__value-box"]}>
              <span className={styles["account-settings__value"]}>
                {user.firstName}
              </span>
              <button
                type="button"
                className={styles["account-settings__edit-btn"]}
                onClick={() =>
                  setEditingField({
                    key: "firstName",
                    label: "First name",
                    value: user.firstName,
                    type: "text",
                    validate: validateFirstName,
                  })
                }
              >
                Edit
              </button>
            </div>
          </div>

          {/* Last Name */}
          <div className={styles["account-settings__item"]}>
            <div className={styles["account-settings__label-box"]}>
              <h4>Last name</h4>
            </div>
            <div className={styles["account-settings__value-box"]}>
              <span
                className={`${styles["account-settings__value"]} ${
                  !user.lastName ? styles["account-settings__value--empty"] : ""
                }`}
              >
                {user.lastName || "Not set"}
              </span>
              <button
                type="button"
                className={styles["account-settings__edit-btn"]}
                onClick={() => {
                  setEditingField({
                    key: "lastName",
                    label: "Last name",
                    value: user.lastName || "",
                    type: "text",
                    validate: validateLastName,
                  });
                }}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Username */}
          <div className={styles["account-settings__item"]}>
            <div className={styles["account-settings__label-box"]}>
              <h4>Username</h4>
            </div>
            <div className={styles["account-settings__value-box"]}>
              <span className={styles["account-settings__value"]}>
                @{user.username}
              </span>
              <button
                type="button"
                className={styles["account-settings__edit-btn"]}
                onClick={() => {
                  setEditingField({
                    key: "username",
                    label: "Username",
                    value: user.username,
                    type: "text",
                    validate: validateUsername,
                  });
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className={styles["account-settings__section"]}>
        <h3 className={styles["account-settings__section-title"]}>Security</h3>

        <div className={styles["account-settings__list"]}>
          {/* Password */}
          <div className={styles["account-settings__item"]}>
            <div className={styles["account-settings__label-box"]}>
              <h4>Password</h4>
            </div>
            {userType === "USERNAME" ? (
              <div className={styles["account-settings__value-box"]}>
                <span className={styles["account-settings__value"]}>
                  ••••••••
                </span>
                <button
                  type="button"
                  className={styles["account-settings__edit-btn"]}
                  onClick={() => {
                    setEditingField({
                      key: "password",
                      label: "Password",
                      value: "",
                      type: "password",
                      validate: validatePassword,
                    });
                  }}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div>
                <span>
                  You are signed in via {capitalizeFirstLetter(userType)}{" "}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {editingField && (
        <EditModal
          errors={errors}
          setErrors={setErrors}
          field={editingField}
          onClose={() => {
            setErrors(null);
            setEditingField(null);
          }}
          onSave={handleSaveField}
        />
      )}
    </div>
  );
}

export default EditFields;
