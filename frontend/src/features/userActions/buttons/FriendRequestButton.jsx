import { useRef } from "react";
import {
  createFriendRequest,
  deleteFriend,
} from "../../../api/functions/users.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import { useData } from "../../../contexts/DataProvider.jsx";

function FreindRequestButton({ companion, setCompanion }) {
  const { isAuthenticated } = useAuth();
  const { sendNotification } = useModal();
  const { removeFriendFromCache } = useData();
  const buttonRef = useRef();

  const areFriends = companion?.friends?.length > 0;
  const hasFriendRequest = companion?.receivedRequests?.length > 0;
  const isFriendRequestDisabled =
    hasFriendRequest || typeof companion?.receivedRequests === "undefined";

  const handleFriendRequest = async () => {
    const { current: button } = buttonRef;
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
      await createFriendRequest(companion?.id);
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
    const button = buttonRef.current;
    const lastContent = button.textContent;
    try {
      button.disabled = true;
      button.textContent = "Deleting friend...";
      await deleteFriend(companion?.id);
      removeFriendFromCache(companion?.id);
      setCompanion((prev) => {
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
    <li>
      {areFriends ? (
        <button ref={buttonRef} onClick={handleDeleteFriend}>
          Delete friend
        </button>
      ) : (
        <button
          disabled={isFriendRequestDisabled}
          ref={buttonRef}
          onClick={handleFriendRequest}
        >
          {hasFriendRequest
            ? "Already sent friend request"
            : "Send friend request"}
        </button>
      )}
    </li>
  );
}

export default FreindRequestButton;
