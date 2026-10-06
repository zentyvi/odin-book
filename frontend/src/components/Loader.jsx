import { useEffect, useState } from "react";
import styles from "../styles/components/Loader.module.css";

function Loader({ label = "Loading...", className = "" }) {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsTimeout(true);
    }, 3000);
  }, []);

  return (
    <div
      data-testid="loader"
      className={`${styles["loader-container"]} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles["loader-orbital"]}>
        <div className={`${styles["orbit"]} ${styles["orbit--outer"]}`}>
          <div className={styles["particle"]} />
        </div>

        <div className={`${styles["orbit"]} ${styles["orbit--inner"]}`}>
          <div className={styles["particle"]} />
        </div>

        <div className={styles["core"]} />
      </div>

      <div className={styles["loader__labels"]}>
        {label && <span className={styles["loader-label"]}>{label}</span>}
        <span
          className={styles["loader-label"]}
          style={{ color: isTimeout ? "var(--text-muted)" : "transparent" }}
          aria-hidden={!isTimeout}
        >
          It may take some time, the server is starting up.
        </span>
      </div>
    </div>
  );
}

export default Loader;
