import { useState } from "react";
import { getRandomNumberFromString } from "../utilis/helpers.js";
const styles = {};

function Avatar({ user, alt, showStatus = false, className = "" }) {
  const [errors, setErrors] = useState(null);
  // Safe fallback if user object is missing
  if (!user) {
    return (
      <div
        className={`${styles["avatar"]} ${className}`}
        aria-label="Unknown user"
      >
        <span className={styles["avatar__fallback"]}>?</span>
      </div>
    );
  }

  // Check if user was active within the last 3.5 minutes (210,000 ms)
  const { isOnline } = user;

  const displayName = user.firstName || "User";
  const gradientId = user.firstName
    ? getRandomNumberFromString(user.firstName, 5)
    : 1;

  return (
    <div
      className={`${styles["avatar"]} ${className}`}
      aria-label={`${displayName}'s avatar`}
    >
      {user.avatarUrl && !errors ? (
        <img
          src={user.avatarUrl}
          alt={alt || `${displayName}'s avatar`}
          className={styles["avatar__image"]}
          onError={() => setErrors("FAILED TO LOAD AVATAR")}
        />
      ) : (
        <div
          className={styles["avatar__placeholder"]}
          aria-label="No custom avatar uploaded"
          data-gradient-id={gradientId}
        >
          <span className={styles["avatar__initial"]}>
            {displayName[0] ? displayName[0]?.toUpperCase() : "?"}
          </span>
        </div>
      )}

      {/* Optional online/offline indicator dot */}
      {showStatus && (
        <span
          className={`${styles["avatar__status-dot"]} ${
            isOnline
              ? styles["avatar__status-dot--online"]
              : styles["avatar__status-dot--offline"]
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}

export default Avatar;
