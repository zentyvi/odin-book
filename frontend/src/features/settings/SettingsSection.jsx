import styles from "../../styles/features/settings/SettingsSection.module.css";

function SettingsSection({ children, title }) {
  const sectionId = title
    ? `settings-section-${title.toLowerCase().replace(/\s+/g, "-")}`
    : undefined;

  return (
    <section className={styles["settings-section"]} aria-labelledby={sectionId}>
      {title && (
        <header className={styles["settings-section__header"]}>
          <h3 id={sectionId} className={styles["settings-section__title"]}>
            {title}
          </h3>
        </header>
      )}
      <div className={styles["settings-section__content"]}>{children}</div>
    </section>
  );
}

export default SettingsSection;
