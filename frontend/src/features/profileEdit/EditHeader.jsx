import { useState, useRef } from "react";
import {
  getCalendarTime,
  getRandomNumberFromString,
  useEscape,
} from "../../utilis/helpers.js";
import { uploadAvatar, deleteAvatar } from "../../api/functions/users.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useData } from "../../contexts/DataProvider.jsx";
const avatarStyles = {};
const styles = {};

function EditHeader() {
  const { user, setUser } = useAuth();
  const { settings } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [errors, setErrors] = useState(null);
  const previewUrl = user?.avatarUrl || null;
  useEscape(() => setIsMenuOpen(false));

  const fileInputRef = useRef(null);

  const handleUploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const result = await uploadAvatar(formData);

      if (result.errors) {
        setErrors(result.errors);
        return false;
      }
      const newAvatar = result.avatarUrl;
      setUser((prev) => ({ ...prev, avatarUrl: newAvatar }));
      setErrors(null);
      return true;
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      return false;
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setUser((prev) => ({ ...prev, avatarUrl: null }));
      setErrors((prev) => ({ ...prev, avatar: null }));
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Failed to delete avatar:", err);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setIsMenuOpen(false);
    if (file.size > 3e6) {
      setErrors({
        avatar: {
          msg: "File size cannot exceed 3 mb",
        },
      });
      return;
    }

    setErrors((prev) => ({ ...prev, avatar: null }));
    await handleUploadAvatar(file);
  };

  const handleDeleteButton = () => {
    if (confirm("Are you sure that you want to delete your avatar?")) {
      handleDeleteAvatar();
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles["profile-header"]}>
      <div className={styles["profile-header__avatar-container"]}>
        <div className={styles["profile-header__avatar-wrapper"]}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Your avatar"
              className={styles["profile-header__avatar-image"]}
            />
          ) : (
            <div
              className={`${styles["profile-header__avatar-placeholder"]} ${avatarStyles["avatar__placeholder"]}`}
              data-gradient-id={
                user?.firstName
                  ? getRandomNumberFromString(user?.firstName, 5)
                  : 1
              }
            >
              {user?.firstName ? user?.firstName[0].toUpperCase() : "?"}
            </div>
          )}

          {/* Centered plus button appearing over dimming overlay */}
          <button
            type="button"
            className={styles["profile-header__overlay-btn"]}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Edit avatar"
            aria-expanded={isMenuOpen}
          >
            <i className="bi bi-plus-lg" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        {/* Action Popover Menu on the right */}
        {isMenuOpen && (
          <>
            <div
              className={styles["profile-header__backdrop"]}
              onClick={() => setIsMenuOpen(false)}
            />
            <div className={styles["profile-header__menu"]} role="menu">
              <button
                type="button"
                className={styles["profile-header__menu-btn"]}
                onClick={handleTriggerFileInput}
                role="menuitem"
              >
                <i className="fa-solid fa-upload" aria-hidden="true"></i>
                <span>Upload</span>
              </button>
              {previewUrl && (
                <button
                  type="button"
                  className={`${styles["profile-header__menu-btn"]} ${styles["profile-header__menu-btn--danger"]}`}
                  onClick={handleDeleteButton}
                  role="menuitem"
                >
                  <i className="fa-solid fa-trash" aria-hidden="true"></i>
                  <span>Delete</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {errors?.avatar && (
        <span className={styles["profile-header__error"]}>
          {errors?.avatar?.msg}
        </span>
      )}

      <div className={styles["profile-header__info"]}>
        <span className={styles["profile-header__id"]}>
          ID: #{user?.id || "N/A"}
        </span>
        <span className={styles["profile-header__created"]}>
          Member since: {getCalendarTime(user?.createdAt, settings?.is24h)}
        </span>
      </div>
    </div>
  );
}

export default EditHeader;
