import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import {
  validateFirstName,
  validateLastName,
  validateUsername,
  validatePassword,
} from "../../utilis/validators.js";
import { updateMyProfile } from "../../api/functions/users.js";
import { capitalizeFirstLetter } from "../../utilis/helpers.js";
import EditModal from "./EditModal.jsx";
import styles from "../../styles/features/profileEdit/EditFields.module.css";

function EditFields() {
  const { user, setUser } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [errors, setErrors] = useState(null);

  const userType = user?.type;

  const handleSaveField = async (data) => {
    try {
      const result = await updateMyProfile(data);
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
        <h2 className={styles["account-settings__section-title"]}>
          Account Info
        </h2>

        <div className={styles["account-settings__list"]}>
          {/* First Name */}
          <div className={styles["account-settings__item"]}>
            <div className={styles["account-settings__label-box"]}>
              <h3 className={styles["acount-settings__subtitle"]}>
                First name
              </h3>
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
              <h3 className={styles["acount-settings__subtitle"]}>Last name</h3>
            </div>
            <div className={styles["account-settings__value-box"]}>
              <span
                className={`${styles["account-settings__value"]} ${
                  !user.lastName
                    ? styles["account-settings__value--dimmed"]
                    : ""
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
              <h3 className={styles["acount-settings__subtitle"]}>Username</h3>
            </div>
            <div className={styles["account-settings__value-box"]}>
              <span className={styles["account-settings__value"]}>
                <span
                  aria-hidden={true}
                  className={styles["account-settings__value--dimmed"]}
                >
                  @
                </span>
                {user.username}
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
        <h2 className={styles["account-settings__section-title"]}>Security</h2>

        <div className={styles["account-settings__list"]}>
          {/* Password */}
          <div className={styles["account-settings__item"]}>
            <div className={styles["account-settings__label-box"]}>
              <h3 className={styles["acount-settings__subtitle"]}>Password</h3>
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
                <span className={styles["account-settings__value--dimmed"]}>
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
