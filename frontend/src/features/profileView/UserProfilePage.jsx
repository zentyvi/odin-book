import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { getUserProfile } from "../../api/functions/users.js";
import { getFullName, makeStatus, useTitle } from "../../utilis/helpers.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";
import UserProfileItems from "./UserProfileItems.jsx";
import ActionsPanel from "../userActions/ActionsPanel.jsx";
import { useData } from "../../contexts/DataProvider.jsx";

function UserProfilePage() {
  const location = useLocation();
  const [user, setUser] = useState(location.state);
  const [loading, setLoading] = useState(!user);
  const [selectedSection, setSelectedSection] = useState("POSTS");
  const { username } = useParams();
  const { settings } = useData();
  const {
    user: currentUser,
    setUser: setCurrentUser,
    updateFriendRequests,
  } = useAuth();

  const isMyProfile = currentUser?.id === user?.id;
  useTitle(isMyProfile ? "Me" : user?.username || "User");

  const count = user?._count;
  const friendRequestsNumber = currentUser?.receivedRequests?.length;
  const fullName = getFullName(user);

  const statsLoaded =
    count?.friends !== undefined &&
    count?.posts !== undefined &&
    count?.comments !== undefined;

  const actionsLoaded =
    user?.receivedRequests !== undefined && user?.id !== undefined;

  let items;
  switch (selectedSection) {
    case "POSTS":
      items = user?.posts;
      break;
    case "COMMENTS":
      items = user?.comments;
      break;
    case "REQUESTS":
      items = currentUser?.receivedRequests;
      break;
  }

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
              <div>
                <Avatar user={user} showStatus={!isMyProfile} />
                <span>
                  {isMyProfile ? "Online" : makeStatus(user, settings.is24h)}
                </span>
              </div>
              {isMyProfile && (
                <div>
                  <Link to="/me/edit" replace={true}>
                    Edit profile <i className="bi bi-pencil-fill" />
                  </Link>
                </div>
              )}
              <div>
                <h2>{fullName}</h2>
                <span>@{user?.username}</span>
              </div>
            </div>
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
              <ActionsPanel companion={user} setCompanion={setUser} />
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
