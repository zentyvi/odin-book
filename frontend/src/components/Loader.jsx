const styles = {};

function Loader({ label = "Loading..." }) {
  return (
    <div
      data-testid="loader"
      className={styles["loader-container"]}
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

      {label && <span className={styles["loader-label"]}>{label}</span>}
    </div>
  );
}

export default Loader;
