import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { getMyFriends } from "../../api/functions/users.js";
import Loader from "../../components/Loader.jsx";
import UserCard from "../../components/UserCard.jsx";

function FriendsPage() {
  const { user, setUser, mergeFriends } = useAuth();
  const friends = user?.friends;
  const [loading, setLoading] = useState(user && friends === undefined);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const freshFriends = await getMyFriends();
        setUser((prev) => {
          return {
            ...prev,
            friends: mergeFriends(prev?.friends || [], freshFriends),
          };
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFriends();
    }
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <main>
      <header>
        <div>
          <h2>Your friends</h2>
          {friends?.length !== undefined && (
            <span>
              {friends.length} {friends.length === 1 ? "Friend" : "Friends"}
            </span>
          )}
        </div>
      </header>
      <main>
        {user ? (
          friends?.length > 0 ? (
            <ul>
              {friends.map((f) => (
                <UserCard user={f} key={f.id} />
              ))}
            </ul>
          ) : (
            <div>
              <div>
                <h3>You don't have friends yet 🫤</h3>
                <p>Send your first friend request!</p>
              </div>
            </div>
          )
        ) : (
          <div>
            <div>
              <h3>You need to log in first</h3>
              <p>You don't have any friends yet</p>
            </div>
            <div>
              <Link to="/auth/log-in" replace={true}>
                Log in
              </Link>
            </div>
          </div>
        )}
      </main>
    </main>
  );
}

export default FriendsPage;
