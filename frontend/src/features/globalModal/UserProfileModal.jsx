import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getFullName } from "../../utilis/helpers.js";
import {
  createFriendRequest,
  getUserPreview,
} from "../../api/functions/users.js";
import Avatar from "../../components/Avatar.jsx";

function UserProfileModal({ data, closeModal }) {
  const [user, setUser] = useState(data);

  const fullName = getFullName(user);
  const hasFriendRequest = user?.receivedRequests?.length > 0;
  const areFriends = user?.friends?.length > 0;
  const isFriendRequestDisabled =
    hasFriendRequest || typeof user?.receivedRequests === "undefined";

  const count = user?._count;
  const requestButtonRef = useRef();

  const statsLoaded =
    typeof count?.friends === "number" &&
    typeof count?.posts === "number" &&
    typeof count?.comments === "number";

  const actionsLoaded =
    typeof user?.receivedRequests !== "undefined" &&
    typeof user?.id !== "undefined";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await getUserPreview(data?.id);
        setUser((prev) => {
          return { ...prev, ...result };
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [data]);

  const handleFriendRequest = async () => {
    try {
      requestButtonRef.current.textContent = "Sending...";
      requestButtonRef.current.disabled = true;
      await createFriendRequest(user?.id);
      requestButtonRef.current.textContent = "Sent!";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        <Link
          aria-label={`To ${fullName}'s profile`}
          to={`/users/${user?.username}`}
          onClick={() => closeModal()}
        >
          <Avatar user={user} />
        </Link>
        <div>
          <div>
            <Link
              aria-label={`To ${fullName}'s profile`}
              to={`/users/${user?.username}`}
              onClick={() => closeModal()}
            >
              <h2>{fullName}</h2>
            </Link>
            <span>@{user?.username}</span>
          </div>
          {statsLoaded ? (
            <ul>
              <li>
                <strong>Friends</strong>
                <span>{count?.friends}</span>
              </li>
              <li>
                <strong>Posts</strong>
                <span>{count?.posts}</span>
              </li>
              <li>
                <strong>Comments</strong>
                <span>{count?.comments}</span>
              </li>
            </ul>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      {actionsLoaded ? (
        <ul>
          <li>
            {areFriends ? (
              <button>Delete friend</button>
            ) : (
              <button
                disabled={isFriendRequestDisabled}
                aria-label="Friend request button"
                ref={requestButtonRef}
                onClick={handleFriendRequest}
              >
                {hasFriendRequest
                  ? "Already sent friend request"
                  : areFriends
                    ? "You're already friends"
                    : "Send friend request"}
              </button>
            )}
          </li>
          <li>
            <button aria-label={`To chat with ${fullName}`}>Chat</button>
          </li>
          <li>
            <Link
              aria-label={`To ${fullName}'s profile`}
              to={`/users/${user?.username}`}
              onClick={() => closeModal()}
            >
              To profile
            </Link>
          </li>
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default UserProfileModal;
