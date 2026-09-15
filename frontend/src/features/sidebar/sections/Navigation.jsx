import { useLocation, Link } from "react-router";
import { getNavigationLinks } from "../../../utilis/navigation_links.jsx";
import SidebarSection from "../SidebarSection.jsx";
import styles from "../../../styles/features/sidebar/sections/Navigation.module.css";

function Navigation({ onItemClick }) {
  const links = getNavigationLinks();
  const { pathname: currentPath } = useLocation();

  return (
    <SidebarSection title="Navigation">
      {links.map((l) => {
        const isActive = currentPath === l.path;

        return (
          <li key={l.path} className={styles["nav-item"]}>
            <Link
              to={l.path}
              className={`${styles["nav-link"]} ${
                isActive ? styles["is-active"] : ""
              }`}
              aria-label={l.title}
              aria-current={isActive ? "page" : undefined}
              title={l.title}
              onClick={onItemClick}
            >
              <span className={styles["nav-link__icon"]}>
                {isActive ? l.active : l.unactive}
              </span>
              <span className={styles["nav-link__text"]}>{l.title}</span>
            </Link>
          </li>
        );
      })}
    </SidebarSection>
  );
}

export default Navigation;
