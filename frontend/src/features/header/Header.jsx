import { Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useSidebar } from "../../contexts/SidebarProvider.jsx";
import { getFullName, useUnreadMessages } from "../../utilis/helpers.js";
import { getNavigationLinks } from "../../utilis/navigation_links.jsx";
import Avatar from "../../components/Avatar.jsx";
import styles from "../../styles/features/header/Header.module.css";

function Header() {
  const { user, isAuthenticated } = useAuth();
  const { pathname: currentPath } = useLocation();
  const { toggleSidebar } = useSidebar();
  const links = getNavigationLinks();

  const friendRequestsNumber = user?.receivedRequests?.length || 0;
  const unreadMessages = useUnreadMessages();

  return (
    <header className={styles.header}>
      <div className={styles["header__main"]}>
        <div className={styles["header__expand-wrapper"]}>
          <button
            className={`btn btn--secondary ${styles["header__expand"]}`}
            type="button"
            aria-label="Toggle sidebar button"
            onClick={toggleSidebar}
          >
            <i className="bi bi-layout-sidebar" />
          </button>
          {unreadMessages > 0 && (
            <span
              className={styles["unread-bage"]}
              aria-label="Unread messages number"
            >
              {unreadMessages > 99 ? "99+" : unreadMessages}
            </span>
          )}
        </div>
        <div className={styles.header__logo}>
          <Link to="/" className={styles["header__logo-title"]}>
            Odin Book
          </Link>
        </div>
      </div>

      <nav className={styles.header__nav}>
        <ul className={styles["header__nav-list"]}>
          {links.map((l) => {
            const isActive = currentPath === l.path;
            return (
              <li key={l.path} className={styles["header__nav-item"]}>
                <Link
                  to={l.path}
                  aria-label={l.title}
                  title={l.title}
                  aria-current={isActive ? "page" : undefined}
                  className={`${styles["header__nav-link"]} ${
                    isActive ? styles["header__nav-link--active"] : ""
                  }`}
                >
                  {isActive ? l.active : l.unactive}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.header__user}>
        {isAuthenticated && user ? (
          <Link
            to={`/users/${user?.username}`}
            aria-label="To your profile"
            state={user}
            className={styles["header__profile-link"]}
          >
            <div className={styles.header__avatar_wrapper}>
              <Avatar user={user} showStatus={false} />
              {friendRequestsNumber > 0 && (
                <span
                  className={styles.header__badge}
                  aria-label="Received friend requests number"
                >
                  {friendRequestsNumber > 99 ? "99+" : friendRequestsNumber}
                </span>
              )}
            </div>
            <div className={styles.header__user_info}>
              <span className={styles.header__user_name}>
                {getFullName(user)}
              </span>
            </div>
          </Link>
        ) : (
          <Link to="/auth/log-in" className="btn btn--primary">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
