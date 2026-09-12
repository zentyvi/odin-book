function SidebarSection({ styles = {}, children, title, open = true }) {
  return (
    <details className={styles["sidebar__details"]} open={open}>
      <summary className={styles["sidebar__summary"]}>
        <h2 className={styles["sidebar__section-title"]}>{title}</h2>
      </summary>
      <ul
        className={styles["sidebar__list"]}
        role="list"
        aria-orientation="vertical"
      >
        {children}
      </ul>
    </details>
  );
}

export default SidebarSection;
