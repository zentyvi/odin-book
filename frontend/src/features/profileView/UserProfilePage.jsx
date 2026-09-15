import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { getUserProfile } from "../../api/functions/users.js";
import { getFullName, makeStatus, useTitle } from "../../utilis/helpers.js";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { useData } from "../../contexts/DataProvider.jsx";
import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";
import UserProfileItems from "./UserProfileItems.jsx";
import ActionsPanel from "../userActions/ActionsPanel.jsx";
import styles from "../../styles/features/profileView/UserProfilePage.module.css";

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
  useTitle(isMyProfile ? "Me" : `${user?.username || "User"}'s Profile`);

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
        if (freshData.id === currentUser.id) {
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
    return (
      <main id="app-content">
        <div className="content-wrapper">
          <Loader className={styles["profile__loader"]} />
        </div>
      </main>
    );
  }

  if (!loading && !user) {
    return (
      <main id="app-content">
        <div className="content-wrapper">
          <div
            className={`${styles["profile-header"]} ${styles["profile-not-found"]}`}
          >
            <h2>User not found 🫤</h2>
            <div className={styles["profile-not-found__actions"]}>
              <Link to={"/"} className="btn btn--primary">
                Home
              </Link>
              <Link to={"/search/users"} className="btn btn--secondary">
                Search
                <i
                  className={`bi bi-search ${styles["search-page__search-icon"]}`}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="app-content">
      <div className="content-wrapper">
        <header className={styles["profile-header"]}>
          <div className={styles["profile-header__top"]}>
            <div className={styles["profile-avatar-wrapper"]}>
              <Avatar
                user={user}
                showStatus={true}
                className={styles["profile-avatar"]}
              />
              <span
                className={`${styles["profile-status"]} ${user?.isOnline ? styles["online"] : ""}`}
              >
                {isMyProfile ? "Online" : makeStatus(user, settings?.is24h)}
              </span>
            </div>

            <div className={styles["profile-meta"]}>
              <div className={styles["profile-details"]}>
                <div className={styles["profile-title-bar"]}>
                  <div>
                    <h1 className={styles["profile-name"]}>{fullName}</h1>
                    <span className={styles["profile-username"]}>
                      @{user?.username}
                    </span>
                  </div>
                </div>

                <div className={styles["profile-stats-container"]}>
                  {statsLoaded ? (
                    <ul className={styles["profile-stats"]}>
                      <li className={styles["profile-stat-item"]}>
                        <span className={styles["profile-stat-value"]}>
                          {count?.friends}
                        </span>
                        <span className={styles["profile-stat-label"]}>
                          Friends
                        </span>
                      </li>
                      <li className={styles["profile-stat-item"]}>
                        <span className={styles["profile-stat-value"]}>
                          {count?.posts}
                        </span>
                        <span className={styles["profile-stat-label"]}>
                          Posts
                        </span>
                      </li>
                      <li className={styles["profile-stat-item"]}>
                        <span className={styles["profile-stat-value"]}>
                          {count?.comments}
                        </span>
                        <span className={styles["profile-stat-label"]}>
                          Comments
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <div className={styles["profile-stats-loading"]}>
                      Loading stats...
                    </div>
                  )}
                </div>
              </div>
              <div className={styles["profile-actions"]}>
                {isMyProfile ? (
                  <Link
                    to="/me/edit"
                    className={`${styles["profile-edit-btn"]} btn btn--secondary`}
                  >
                    Edit profile <i className="bi bi-pencil-fill" />
                  </Link>
                ) : (
                  <div className={styles["profile-actions-wrapper"]}>
                    {actionsLoaded ? (
                      <ActionsPanel
                        companion={user}
                        setCompanion={setUser}
                        className={styles["profile-header__actions"]}
                      />
                    ) : (
                      <div>Loading actions...</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className={styles["profile-nav"]}>
            <ul className={styles["profile-nav__list"]}>
              <li>
                <button
                  type="button"
                  className={`${styles["profile-nav__btn"]} ${
                    selectedSection === "POSTS" ? styles["is-active"] : ""
                  }`}
                  onClick={() => setSelectedSection("POSTS")}
                >
                  Posts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`${styles["profile-nav__btn"]} ${
                    selectedSection === "COMMENTS" ? styles["is-active"] : ""
                  }`}
                  onClick={() => setSelectedSection("COMMENTS")}
                >
                  Comments
                </button>
              </li>
              {isMyProfile && (
                <li>
                  <button
                    type="button"
                    className={`${styles["profile-nav__btn"]} ${
                      selectedSection === "REQUESTS" ? styles["is-active"] : ""
                    }`}
                    onClick={() => setSelectedSection("REQUESTS")}
                  >
                    Friend requests
                    {friendRequestsNumber > 0 && (
                      <span
                        className={styles["profile-nav__badge"]}
                        aria-label="Received friend requests number"
                      >
                        {friendRequestsNumber}
                      </span>
                    )}
                  </button>
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
      </div>
    </main>
  );
}

export default UserProfilePage;
