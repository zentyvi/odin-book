import { useState } from "react";
import styles from "../styles/components/FormInput.module.css";

function FormInput({
  disabled,
  type = "text",
  name,
  id,
  value,
  onChange,
  isRequired = false,
  label,
  placeholder = "",
  cols = 30,
  rows = 4,
  error,
  subTitle,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = error?.msg || (typeof error === "string" ? error : null);

  const inputClassName = `${styles["input-field"]} ${
    errorMessage ? styles["input-field--error"] : ""
  }`;

  return (
    <div className={styles["input-wrapper"]}>
      {label && (
        <label htmlFor={id} className={styles["input-label"]}>
          <span>{label}</span>
          {isRequired && <span className={styles["input-required"]}>*</span>}
        </label>
      )}

      {subTitle && <span className={styles["input-subtitle"]}>{subTitle}</span>}

      {type !== "textarea" ? (
        <div className={styles["input-container"]}>
          {/* Dynamically toggle input type between password and text */}
          <input
            disabled={disabled}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            name={name || id}
            id={id}
            value={value}
            onChange={onChange}
            required={isRequired}
            placeholder={placeholder}
            className={inputClassName}
          />
          {type === "password" && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={styles["input-toggle-password-btn"]}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash-fill" aria-hidden="true" />
              ) : (
                <i className="bi bi-eye-fill" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      ) : (
        <textarea
          disabled={disabled}
          name={name || id}
          id={id}
          onChange={onChange}
          required={isRequired}
          placeholder={placeholder}
          cols={cols}
          rows={rows}
          value={value}
          className={`${inputClassName} ${styles["input-field--textarea"]}`}
        />
      )}

      {errorMessage && (
        <span className={styles["input-error-msg"]}>{errorMessage}</span>
      )}
    </div>
  );
}

export default FormInput;
