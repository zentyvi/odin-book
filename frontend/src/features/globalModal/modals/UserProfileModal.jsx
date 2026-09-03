import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getFullName } from "../../../utilis/helpers.js";
import {
  createFriendRequest,
  deleteFriend,
  getUserPreview,
} from "../../../api/functions/users.js";
import Avatar from "../../../components/Avatar.jsx";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import { useModal } from "../../../contexts/ModalProvider.jsx";

function UserProfileModal({ data, closeModal }) {
  const [user, setUser] = useState(data);
  const { sendNotification } = useModal();
  const {
    user: currentUser,
    removeFriendFromCache,
    isAuthenticated,
  } = useAuth();

  const isMyProfile = currentUser?.id === user?.id;
  const fullName = getFullName(user);
  const hasFriendRequest = user?.receivedRequests?.length > 0;
  const areFriends = user?.friends?.length > 0;
  const isFriendRequestDisabled =
    hasFriendRequest || typeof user?.receivedRequests === "undefined";

  const count = user?._count;
  const requestButtonRef = useRef();

  const statsLoaded =
    count?.friends !== undefined &&
    count?.posts !== undefined &&
    count?.comments !== undefined;

  const actionsLoaded =
    user?.receivedRequests !== undefined && user?.id !== undefined;

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
    const { current: button } = requestButtonRef;
    const lastContent = button.textContent;
    try {
      if (!isAuthenticated) {
        sendNotification(
          "Error",
          "Please log in first to add friends",
          "ERROR",
        );
        button.disabled = true;
        setTimeout(() => {
          button.disabled = false;
        }, 3000);
        return;
      }
      button.textContent = "Sending...";
      button.disabled = true;
      await createFriendRequest(user?.id);
      button.textContent = "Sent!";
    } catch (err) {
      button.textContent = "Error has occured";
      setTimeout(() => {
        button.textContent = lastContent;
        button.disabled = false;
      }, 3000);
      console.error(err);
    }
  };

  const handleDeleteFriend = async () => {
    if (!confirm("Are you sure that you want to delete this friend&")) {
      return;
    }
    const button = requestButtonRef.current;
    const lastContent = button.textContent;
    try {
      button.disabled = true;
      button.textContent = "Deleting friend...";
      await deleteFriend(user?.id);
      removeFriendFromCache(user?.id);
      setUser((prev) => {
        const newFriendsCount = prev._count?.friends - 1;
        return {
          ...prev,
          _count: { ...prev._count, friends: newFriendsCount },
          friends: [],
        };
      });
    } catch (err) {
      button.textContent = "Error has occured";
      setTimeout(() => {
        button.textContent = lastContent;
        button.disabled = false;
      }, 3000);
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
          state={user}
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
      {!isMyProfile && (
        <div>
          {actionsLoaded ? (
            <ul>
              <li>
                {areFriends ? (
                  <button ref={requestButtonRef} onClick={handleDeleteFriend}>
                    Delete friend
                  </button>
                ) : (
                  <button
                    disabled={isFriendRequestDisabled}
                    ref={requestButtonRef}
                    onClick={handleFriendRequest}
                  >
                    {hasFriendRequest
                      ? "Already sent friend request"
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
                  state={user}
                >
                  To profile
                </Link>
              </li>
            </ul>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfileModal;
