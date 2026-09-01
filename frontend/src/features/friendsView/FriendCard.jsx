import Avatar from "../../components/Avatar.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";

function FriendCard({ friend }) {
  const { openModal } = useModal();
  const fullName = getFullName(friend);

  return (
    <li>
      <div>
        <button
          aria-label={`Open ${fullName}'s profile`}
          onClick={() => openModal("USER_PREVIEW", friend)}
        >
          <Avatar user={friend} />
        </button>
        <div>
          <button
            aria-label={`Open ${fullName}'s profile`}
            onClick={() => openModal("USER_PREVIEW", friend)}
          >
            <h3>{fullName}</h3>
          </button>
          <span>@{friend?.username}</span>
        </div>
      </div>
      <div>
        <button>Chat</button>
      </div>
    </li>
  );
}

export default FriendCard;
