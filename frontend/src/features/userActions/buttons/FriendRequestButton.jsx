import { useRef } from "react";
import {
  createFriendRequest,
  deleteFriend,
  handleRequestAction,
} from "../../../api/functions/users.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import { useModal } from "../../../contexts/ModalProvider.jsx";

function FreindRequestButton({ companion, setCompanion, className }) {
  const {
    user,
    isAuthenticated,
    removeFriendFromCache,
    removeFriendReqestFromCache,
    addFriendToCache,
    setUser,
  } = useAuth();
  const { sendNotification } = useModal();
  const buttonRef = useRef();

  const areFriends = companion?.friends?.length > 0;
  const sentFriendRequest = companion?.receivedRequests?.length > 0;
  const gotFriendRequest = companion.sentRequests?.length > 0;
  const isFriendRequestDisabled =
    sentFriendRequest || typeof companion?.receivedRequests === "undefined";

  let textContent;

  if (sentFriendRequest) {
    textContent = "Already sent friend request";
  } else if (gotFriendRequest) {
    textContent = "Accept friend request";
  } else {
    textContent = "Send friend request";
  }

  const handleAcceptFriendRequest = async () => {
    const { current: button } = buttonRef;
    const lastContent = button.textContent;
    try {
      button.disabled = true;
      button.textContent = "Accepting...";
      const request = companion.sentRequests[0];
      const result = await handleRequestAction(request?.id, "ACCEPT");
      removeFriendReqestFromCache(request?.id);
      addFriendToCache(companion);
      setCompanion((prev) => {
        return {
          ...prev,
          _count: {
            ...prev._count,
            friends: prev._count?.friends ? prev._count?.friends + 1 : 1,
          },
          friends: [user],
          receivedRequests: [],
          sentRequests: [],
        };
      });
      setUser((prev) => {
        return {
          ...prev,
          _count: {
            ...prev._count,
            friends: result._count.friends,
          },
          receivedRequests: prev.receivedRequests.filter(
            (r) => r.id !== request.id,
          ),
        };
      });
    } catch (err) {
      button.textContent = "Error has occured";
      setInterval(() => {
        button.disabled = false;
        button.textContent = lastContent;
      }, 3000);
      console.error(err);
    }
  };

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
    if (!confirm("Are you sure that you want to delete this friend?")) {
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
    <>
      {areFriends ? (
        <button
          ref={buttonRef}
          onClick={handleDeleteFriend}
          className={`btn btn--primary ${className}`}
        >
          Delete friend
        </button>
      ) : (
        <button
          className={`btn btn--primary ${className}`}
          disabled={isFriendRequestDisabled}
          ref={buttonRef}
          onClick={
            gotFriendRequest ? handleAcceptFriendRequest : handleFriendRequest
          }
        >
          {textContent}
        </button>
      )}
    </>
  );
}

export default FreindRequestButton;
