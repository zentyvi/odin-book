import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getFullName } from "../../../utilis/helpers.js";
import { getUserPreview } from "../../../api/functions/users.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import Avatar from "../../../components/Avatar.jsx";
import ActionsPanel from "../../userActions/ActionsPanel.jsx";

function UserProfileModal({ data, closeModal }) {
  const [user, setUser] = useState(data);
  const { user: currentUser } = useAuth();

  const count = user?._count;
  const isMyProfile = currentUser?.id === user?.id;
  const fullName = getFullName(user);

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

  return (
    <div>
      <div>
        <Link
          aria-label={`To ${fullName}'s profile`}
          to={`/users/${user?.username}`}
          onClick={() => closeModal()}
          state={user}
        >
          <Avatar user={user} showStatus={!isMyProfile} />
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
            <ActionsPanel companion={user} setCompanion={setUser}>
              <li>
                <Link
                  to={`/users/${user?.username || user?.id}`}
                  replace={true}
                >
                  To profile
                </Link>
              </li>
            </ActionsPanel>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfileModal;
