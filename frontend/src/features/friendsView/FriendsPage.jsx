import { useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { getMyFriends } from "../../api/functions/users.js";
import { mergeData, useTitle } from "../../utilis/helpers.js";
import Loader from "../../components/Loader.jsx";
import UserCard from "../../components/UserCard.jsx";
import styles from "../../styles/features/friendsView/FriendsPage.module.css";

function FriendsPage() {
  const { user, setUser } = useAuth();
  const friends = user?.friends;
  useTitle("Friends");
  const loading = typeof friends === "undefined";

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const freshFriends = await getMyFriends();
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            friends: mergeData(prev?.friends || [], freshFriends),
          };
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchFriends();
    }
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <main id="app-content">
        <div className={`content-wrapper ${styles["friends-page__loader"]}`}>
          <Loader />;
        </div>
      </main>
    );
  }

  return (
    <main id="app-content" aria-labelledby="friends-title">
      <div className="content-wrapper">
        <header className={styles["friends-page__header"]}>
          <div className={styles["friends-page__title-group"]}>
            <h2 id="friends-title" className={styles["friends-page__title"]}>
              Your friends
            </h2>
            {friends?.length > 0 && (
              <span className={styles["friends-page__count"]}>
                {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
              </span>
            )}
          </div>
        </header>

        <div className={styles["friends-page__content"]}>
          {user ? (
            friends?.length > 0 ? (
              <ul className={styles["friends-page__feed"]}>
                {friends.map((friend) => (
                  <li key={friend.id} className={styles["friends-page__item"]}>
                    <UserCard user={friend} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles["friends-page__empty"]}>
                <h3 className={styles["friends-page__empty-title"]}>
                  You don't have friends yet 🫤
                </h3>
                <p className={styles["friends-page__empty-text"]}>
                  Send your first friend request!
                </p>
              </div>
            )
          ) : (
            <div className={styles["friends-page__unauth"]}>
              <div className={styles["friends-page__unauth-text"]}>
                <h3 className={styles["friends-page__unauth-title"]}>
                  You need to log in first
                </h3>
                <p className={styles["friends-page__unauth-subtitle"]}>
                  Log in to view your friends list
                </p>
              </div>
              <Link to="/auth/log-in" className="btn btn--primary">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default FriendsPage;
