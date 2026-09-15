import { useEffect } from "react";
import { Link } from "react-router";
import { getMyChats } from "../../api/functions/users.js";
import { getFullName } from "../../utilis/helpers.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useData } from "../../contexts/DataProvider.jsx";
import { useSidebar } from "../../contexts/SidebarProvider.jsx";
import Avatar from "../../components/Avatar.jsx";
import Navigation from "./sections/Navigation.jsx";
import Chats from "./sections/Chats/Chats.jsx";
import styles from "../../styles/features/sidebar/Sidebar.module.css";
import "../../styles/features/sidebar/ChatPageSidebar.css";

function Sidebar({ onClose }) {
  const { chats, updateChatsInCache } = useData();
  const { user, isAuthenticated } = useAuth();
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!isAuthenticated || !user) {
          return;
        }
        const chatsData = await getMyChats();
        updateChatsInCache(chatsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`${styles["sidebar"]} ${isSidebarOpen ? styles["expanded"] : ""}`}
    >
      <button
        type="button"
        aria-label="Close sidebar"
        className={styles["sidebar__close-btn"]}
        onClick={handleClose}
      >
        <i className="bi bi-x-lg" />
      </button>

      {isAuthenticated && (
        <div className={styles["sidebar__header"]}>
          <Link
            to={`/users/${user?.username || user?.id}`}
            className={styles["sidebar__user-link"]}
            onClick={handleClose}
          >
            <Avatar
              user={user}
              showStatus={false}
              className={styles["sidebar__avatar"]}
            />
            <div className={styles["sidebar__user-info"]}>
              <h2 className={styles["sidebar__user-name"]}>
                {getFullName(user)}
              </h2>
              <span className={styles["sidebar__user-handle"]}>
                @{user?.username}
              </span>
            </div>
          </Link>
        </div>
      )}

      <div className={styles["sidebar__content"]}>
        <nav className={styles["sidebar__nav"]} aria-label="Site navigation">
          <Navigation styles={styles} onItemClick={handleClose} />
          <Chats chats={chats} onItemClick={handleClose} />
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
