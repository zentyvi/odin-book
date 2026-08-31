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
    path: "/create/post",
    title: "Create post",
    unactive: <i className="bi bi-stickies" />,
    active: <i className="bi bi-stickies-fill" />,
  },
];

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const authContext = useAuth();
  const user = authContext?.user;

  return (
    <header>
      <div>
        <h1>Odin Book</h1>
      </div>
      <div>
        <ul>
          {links.map((l) => (
            <li key={l.path}>
              <Link to={l.path} aria-label={l.title}>
                {currentPath === l.path ? l.active : l.unactive}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link to={`/users/${user?.username}`}>
          <Avatar user={user} showStatus={false} />
          <div>
            <span>{getFullName(user)}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
