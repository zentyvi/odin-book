import { useModal } from "../../contexts/ModalProvider.jsx";
import { getFullName } from "../../utilis/helpers.js";
import { handleRequestAction } from "../../api/functions/users.js";
import Avatar from "../../components/Avatar.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";

function FriendRequestItem({ request, setUser }) {
  const { removeFriendReqestFromCache } = useAuth();
  const { openModal } = useModal();
  const sender = request?.sender;
  const fullName = getFullName(sender);

  const handleModal = () => {
    openModal("USER_PREVIEW", sender);
  };

  const handleAction = async (action) => {
    try {
      const result = await handleRequestAction(request?.id, action);
      removeFriendReqestFromCache(request?.id);
      setUser((prev) => {
        return {
          ...prev,
          _count: {
            ...prev._count,
            friends:
              action === "ACCEPT"
                ? result._count.friends
                : prev?._count?.friends,
          },
          receivedRequests: prev.receivedRequests.filter(
            (r) => r.id !== request.id,
          ),
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li>
      <div>
        <button aria-label={`Open ${fullName}'s profile`} onClick={handleModal}>
          <Avatar user={sender} />
        </button>
        <div>
          <button
            aria-label={`Open ${fullName}'s profile`}
            onClick={handleModal}
          >
            <h4>{fullName}</h4>
          </button>
          <span>@{sender?.username}</span>
        </div>
      </div>
      <div>
        <button
          aria-label="Accept friend request"
          onClick={() => handleAction("ACCEPT")}
        >
          <i className="bi bi-check-lg" />
        </button>
        <button
          aria-label="Reject friend request"
          onClick={() => handleAction("REJECT")}
        >
          <i className="bi bi-ban" />
        </button>
      </div>
    </li>
  );
}

export default FriendRequestItem;
