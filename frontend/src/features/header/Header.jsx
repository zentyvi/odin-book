import { Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";
import { getNavigationLinks } from "../../utilis/navigation_links.jsx";
import Avatar from "../../components/Avatar.jsx";

function Header() {
  const { user, isAuthenticated } = useAuth();
  const links = getNavigationLinks();
  const { pathname: currentPath } = useLocation();

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
