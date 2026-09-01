import Avatar from "../../components/Avatar.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";

function UserResultRow({ user }) {
  const { openModal } = useModal();
  const fullName = getFullName(user);

  return (
    <li>
      <div>
        <button
          aria-label={`Open ${fullName}'s profile`}
          onClick={() => openModal("USER_PREVIEW", user)}
        >
          <Avatar user={user} />
        </button>
        <div>
          <button
            aria-label={`Open ${fullName}'s profile`}
            onClick={() => openModal("USER_PREVIEW", user)}
          >
            <h3>{fullName}</h3>
          </button>
          <span>@{user?.username}</span>
        </div>
      </div>
      <div>
        <button>Chat</button>
      </div>
    </li>
  );
}

export default UserResultRow;
