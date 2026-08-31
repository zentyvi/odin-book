import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router";
import {
  getUserProfile,
  createFriendRequest,
} from "../../api/functions/users.js";
import { getFullName } from "../../utilis/helpers.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";
import UserProfileItems from "./UserProfileItems.jsx";

function UserProfilePage() {
  const location = useLocation();
  const [user, setUser] = useState(location.state);
  const [loading, setLoading] = useState(!user);
  const [selectedSection, setSelectedSection] = useState("POSTS");
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const isMyProfile = currentUser?.id === user?.id;

  const fullName = getFullName(user);
  const hasFriendRequest = user?.receivedRequests?.length > 0;
  const areFriends = user?.friends?.length > 0;
  const isFriendRequestDisabled =
    hasFriendRequest || typeof user?.receivedRequests === "undefined";
  const requestButtonRef = useRef();

  const count = user?._count;
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
    typeof count?.friends === "number" &&
    typeof count?.posts === "number" &&
    typeof count?.comments === "number";

  const actionsLoaded =
    typeof user?.receivedRequests !== "undefined" &&
    typeof user?.id !== "undefined";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setSelectedSection("POSTS");
        const freshData = await getUserProfile(username);
        setUser(freshData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

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
          <Avatar user={user} />
          <div>
            <div>
              <h2>{fullName}</h2>
              <span>@{user?.username}</span>
            </div>
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
              </li>
            )}
          </ul>
        </nav>
      </header>
      <UserProfileItems type={selectedSection} data={items} setUser={setUser} />
    </main>
  );
}

export default UserProfilePage;
