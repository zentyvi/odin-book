import { useAuth } from "../../contexts/AuthProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";
import Avatar from "../../components/Avatar.jsx";

const links = [
  {
    path: "/home",
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
    path: "/posts/create",
    title: "Create post",
    unactive: <i className="bi bi-stickies" />,
    active: <i className="bi bi-stickies-fill" />,
  },
];

function Header() {
  const authContext = useAuth();
  const selected = location.pathname;
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
              <a href={l.path} aria-label={l.title}>
                {selected === l.path ? l.active : l.unactive}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Avatar user={user} showStatus={false} />
        <div>
          <span>{getFullName(user)}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
