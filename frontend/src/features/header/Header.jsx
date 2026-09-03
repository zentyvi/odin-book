import { Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";
import Avatar from "../../components/Avatar.jsx";

const links = [
  {
    path: "/",
    title: "Home",
    unactive: <i className="bi bi-house" />,
    active: <i className="bi bi-house-fill" />,
  },
  {
    path: "/friends",
    title: "Friends",
    unactive: <i className="bi bi-people" />,
    active: <i className="bi bi-people-fill" />,
  },
  {
    path: "/search/users",
    title: "Search users",
    unactive: <i className="bi bi-search-heart" />,
    active: <i className="bi bi-search-heart-fill" />,
  },
  {
    path: "/create/post",
    title: "Create post",
    unactive: <i className="bi bi-stickies" />,
    active: <i className="bi bi-stickies-fill" />,
  },
  {
    path: "/settings",
    title: "Settings",
    unactive: <i className="bi bi-gear" />,
    active: <i className="bi bi-gear-fill" />,
  },
];

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, isAuthenticated } = useAuth();

  const friendRequestsNumber = user?.receivedRequests?.length;

  return (
    <header>
      <div>
        <Link to="/" replace={true}>
          <h1>Odin Book</h1>
        </Link>
      </div>
      <div>
        <ul>
          {links.map((l) => (
            <li key={l.path}>
              <Link to={l.path} aria-label={l.title} title={l.title}>
                {currentPath === l.path ? l.active : l.unactive}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {isAuthenticated && user ? (
          <Link
            to={`/users/${user?.username}`}
            aria-label="To your profile"
            state={user}
          >
            <div>
              <Avatar user={user} showStatus={false} />
              {friendRequestsNumber > 0 && (
                <span aria-label="Received friend requests number">
                  {friendRequestsNumber}
                </span>
              )}
            </div>
            <div>
              <span>{getFullName(user)}</span>
            </div>
          </Link>
        ) : (
          <>
            <Link to="/auth/log-in" replace={true}>
              Log in
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
