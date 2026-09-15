import { useState, useEffect, useRef } from "react";
import FocusLock from "react-focus-lock";
import { useEscape } from "../../utilis/helpers.js";
import styles from "../../styles/features/profileEdit/EditModal.module.css";

function EditModal({ field, onClose, onSave, errors, setErrors }) {
  const [value, setValue] = useState(field?.value || "");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const initialValue = useRef(field?.value || "");
  useEscape(() => onClose());

  const error = errors?.[`infoToUpdate.${field?.key}`];
  const confirmPasswordError = errors?.confirmPassword;

  const isSameValue =
    // eslint-disable-next-line react-hooks/refs
    value.toLowerCase() === initialValue.current.toLowerCase();
  const isDisabled = isSameValue || value.trim().length === 0 || Boolean(error);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(field?.value || "");
    setPasswordConfirm("");
  }, [field]);

  if (!field) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ infoToUpdate: { [field.key]: value }, passwordConfirm });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setValue(value);
    if (field.validate) {
      field.validate(e, setValue, setErrors, `infoToUpdate.${field?.key}`);
    }
  };

  return (
    <FocusLock returnFocus={true}>
      <div className={styles["edit-modal"]} onClick={onClose}>
        {/* Modal Window Container */}
        <div
          className={styles["edit-modal__card"]}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <header className={styles["edit-modal__header"]}>
            <h3 id="edit-modal-title" className={styles["edit-modal__title"]}>
              Change {field.label}
            </h3>
            <button
              type="button"
              className={styles["edit-modal__close-btn"]}
              onClick={onClose}
              aria-label="Close modal"
            >
              <i className="bi bi-x-lg" />
            </button>
          </header>

          <form className={styles["edit-modal__form"]} onSubmit={handleSubmit}>
            <div className={styles["edit-modal__field"]}>
              <label
                className={styles["edit-modal__label"]}
                htmlFor="new-value"
              >
                Enter new {field.label.toLowerCase()}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className={styles["edit-modal__input"]}
                  value={value}
                  onChange={handleChange}
                  autoFocus
                  required
                  id="new-value"
                />
              ) : (
                <input
                  type={
                    field.type === "password"
                      ? showPasswords
                        ? "text"
                        : "password"
                      : field.type || "text"
                  }
                  className={styles["edit-modal__input"]}
                  value={value}
                  onChange={handleChange}
                  autoFocus
                  required
                  id="new-value"
                />
              )}

              {error && (
                <span className={styles["edit-modal__error"]}>{error.msg}</span>
              )}
            </div>

            {field.type === "password" && (
              <div className={styles["edit-modal__field"]}>
                <label
                  className={styles["edit-modal__label"]}
                  htmlFor="password-confirmation"
                >
                  Your old password
                </label>
                <input
                  required
                  type={showPasswords ? "text" : "password"}
                  className={styles["edit-modal__input"]}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  id="password-confirmation"
                />

                {confirmPasswordError && (
                  <span className={styles["edit-modal__error"]}>
                    {confirmPasswordError.msg}
                  </span>
                )}
              </div>
            )}

            <div className={styles["edit-modal__actions"]}>
              {field.type === "password" && (
                <button
                  className="btn btn--secondary"
                  type="button"
                  aria-label="Show passwords"
                  aria-pressed={showPasswords}
                  onClick={() => {
                    setShowPasswords(!showPasswords);
                  }}
                >
                  {showPasswords ? (
                    <i className="bi bi-eye-slash-fill" />
                  ) : (
                    <i className="bi bi-eye-fill" />
                  )}
                </button>
              )}
              <button
                type="button"
                className={styles["edit-modal__btn--cancel"]}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles["edit-modal__btn--save"]}
                disabled={isDisabled}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </FocusLock>
  );
}

export default EditModal;
