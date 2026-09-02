import Avatar from "./Avatar.jsx";
import { useModal } from "../contexts/ModalProvider.jsx";
import { getFullName } from "../utilis/helpers.js";

function UserCard({ user }) {
  const { openModal } = useModal();
  const fullName = getFullName(user);

  return (
    <li>
      <button
        aria-label={`Open ${fullName}'s profile`}
        onClick={() => openModal("USER_PREVIEW", user)}
      >
        <Avatar user={user} />
        <div>
          <h3>{fullName}</h3>
          <span>@{user?.username}</span>
        </div>
      </button>
    </li>
  );
}

export default UserCard;
