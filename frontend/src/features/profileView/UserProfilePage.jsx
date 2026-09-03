import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router";
import {
  getUserProfile,
  createFriendRequest,
  deleteFriend,
} from "../../api/functions/users.js";
import { getFullName, useTitle } from "../../utilis/helpers.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";
import UserProfileItems from "./UserProfileItems.jsx";

function UserProfilePage() {
  const location = useLocation();
  const [user, setUser] = useState(location.state);
  const [loading, setLoading] = useState(!user);
  const [selectedSection, setSelectedSection] = useState("POSTS");
  const { username } = useParams();
  const { sendNotification } = useModal();
  const {
    user: currentUser,
    setUser: setCurrentUser,
    updateFriendRequests,
    removeFriendFromCache,
    isAuthenticated,
  } = useAuth();

  const isMyProfile = currentUser?.id === user?.id;
  useTitle(isMyProfile ? "Me" : user?.username || "User");

  const fullName = getFullName(user);
  const hasFriendRequest = user?.receivedRequests?.length > 0;
  const areFriends = user?.friends?.length > 0;
  const isFriendRequestDisabled =
    hasFriendRequest || typeof user?.receivedRequests === "undefined";
  const requestButtonRef = useRef();

  const count = user?._count;
  const friendRequestsNumber = currentUser?.receivedRequests?.length;
  let items;
  switch (selectedSection) {
    case "POSTS":
      items = user?.posts;
      break;
    case "COMMENTS":
      items = user?.comments;
      break;
    case "REQUESTS":
      items = user?.receivedRequests;
      break;
  }

  const statsLoaded =
    count?.friends !== undefined &&
    count?.posts !== undefined &&
    count?.comments !== undefined;

  const actionsLoaded =
    user?.receivedRequests !== undefined && user?.id !== undefined;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setSelectedSection("POSTS");
        const freshData = await getUserProfile(username);
        if (isMyProfile) {
          setCurrentUser(freshData);
          updateFriendRequests(freshData?.receivedRequests || []);
        }
        setUser(freshData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line
  }, [username]);

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
    const { current: button } = requestButtonRef;
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

  if (loading) {
    return <Loader />;
  }

  if (!loading && !user) {
    return <div>User not found</div>;
  }

  return (
    <main>
      <header>
        <div>
          <div>
            <div>
              <Avatar user={user} />
              <div>
                <h2>{fullName}</h2>
                <span>@{user?.username}</span>
              </div>
            </div>
            {isMyProfile && (
              <div>
                <Link to="/me/edit" replace={true}>
                  Edit profile <i className="bi bi-pencil-fill" />
                </Link>
              </div>
            )}
          </div>
          <div>
            <div>
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
                        : areFriends
                          ? "You're already friends"
                          : "Send friend request"}
                    </button>
                  )}
                </li>
                <li>
                  <button aria-label={`To chat with ${fullName}`}>Chat</button>
                </li>
              </ul>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        )}
        <nav>
          <ul>
            <li>
              <button onClick={() => setSelectedSection("POSTS")}>Posts</button>
            </li>
            <li>
              <button onClick={() => setSelectedSection("COMMENTS")}>
                Comments
              </button>
            </li>
            {isMyProfile && (
              <li>
                <button onClick={() => setSelectedSection("REQUESTS")}>
                  Friend requests
                </button>
                {friendRequestsNumber > 0 && (
                  <span aria-label="Received friend requests number">
                    {friendRequestsNumber}
                  </span>
                )}
              </li>
            )}
          </ul>
        </nav>
      </header>
      <UserProfileItems
        type={selectedSection}
        data={items}
        setUser={setUser}
        isMyProfile={isMyProfile}
      />
    </main>
  );
}

export default UserProfilePage;
