import { useEffect } from "react";
import { Link } from "react-router";
import { getMyChats } from "../../api/functions/users.js";
import { getFullName } from "../../utilis/helpers.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useData } from "../../contexts/DataProvider.jsx";
import Avatar from "../../components/Avatar.jsx";
import Navigation from "./sections/Navigation.jsx";
import Chats from "./sections/Chats/Chats.jsx";
const styles = {};

function Sidebar() {
  const { chats, updateChatsInCache } = useData();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!isAuthenticated || !user) {
          return;
        }
        const chats = await getMyChats();
        updateChatsInCache(chats);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleClose = () => {};

  return (
    <aside>
      <button
        aria-label="Close sidebar"
        className={styles["close-button"]}
        onClick={handleClose}
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      {isAuthenticated && (
        <div className={styles["sidebar__header"]}>
          <Link to={`/users/${user?.id}`} replace={true}>
            <Avatar user={user} showStatus={false} />
            <div>
              <h2>{getFullName(user)}</h2>
              <span>@{user?.username}</span>
            </div>
          </Link>
        </div>
      )}
      <nav
        className={styles["sidebar__mobile-nav"]}
        aria-label="Site navigation"
      >
        <Navigation styles={styles} />
        <Chats chats={chats} />
      </nav>
    </aside>
  );
}

export default Sidebar;
