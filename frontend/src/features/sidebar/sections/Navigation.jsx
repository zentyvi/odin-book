import { useLocation, Link } from "react-router";
import { getNavigationLinks } from "../../../utilis/navigation_links.jsx";
import SidebarSection from "../SidebarSection.jsx";

function Navigation({ styles = {} }) {
  const links = getNavigationLinks();
  const { pathname: currentPath } = useLocation();
  return (
    <SidebarSection styles={styles} title="Navigation" open={false}>
      {links.map((l) => (
        <li key={l.path}>
          <Link to={l.path} aria-label={l.title} title={l.title}>
            {currentPath === l.path ? l.active : l.unactive}
            <span>{l.title}</span>
          </Link>
        </li>
      ))}
    </SidebarSection>
  );
}

export default Navigation;
