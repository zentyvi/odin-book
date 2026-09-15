import styles from "../../styles/features/sidebar/SidebarSection.module.css";

function SidebarSection({ children, title, defaultOpen = true }) {
  return (
    <details className={styles["sidebar-section"]} open={defaultOpen}>
      <summary className={styles["sidebar-section__summary"]}>
        <span className={styles["sidebar-section__title"]}>{title}</span>
        <i
          className={`bi bi-chevron-down ${styles["sidebar-section__icon"]}`}
        />
      </summary>
      <ul className={styles["sidebar-section__list"]}>{children}</ul>
    </details>
  );
}

export default SidebarSection;
