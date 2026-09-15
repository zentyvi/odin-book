import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getFullName } from "../../../utilis/helpers.js";
import { getUserPreview } from "../../../api/functions/users.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
import Avatar from "../../../components/Avatar.jsx";
import ActionsPanel from "../../userActions/ActionsPanel.jsx";
import styles from "../../../styles/features/globalModal/UserProfileModal.module.css";

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
        setUser((prev) => ({ ...prev, ...result }));
      } catch (err) {
        console.error(err);
      }
    };

    if (data?.id) {
      fetchUserData();
    }
  }, [data]);

  return (
    <div className={styles["user-profile-modal"]}>
      <div className={styles["user-profile-modal__header"]}>
        <Link
          aria-label={`To ${fullName}'s profile`}
          to={`/users/${user?.username}`}
          onClick={closeModal}
          state={user}
          className={styles["user-profile-modal__avatar-link"]}
        >
          <Avatar
            user={user}
            showStatus={!isMyProfile}
            className={styles["user-profile-modal__avatar"]}
          />
        </Link>

        <div className={styles["user-profile-modal__info"]}>
          <div className={styles["user-profile-modal__names"]}>
            <Link
              aria-label={`To ${fullName}'s profile`}
              to={`/users/${user?.username}`}
              onClick={closeModal}
              className={styles["user-profile-modal__name-link"]}
            >
              <h2 className={styles["user-profile-modal__fullname"]}>
                {fullName}
              </h2>
            </Link>
            <span className={styles["user-profile-modal__username"]}>
              @{user?.username}
            </span>
          </div>

          {statsLoaded ? (
            <ul className={styles["user-profile-modal__stats"]}>
              <li className={styles["user-profile-modal__stat-item"]}>
                <span className={styles["user-profile-modal__stat-label"]}>
                  Friends
                </span>
                <strong className={styles["user-profile-modal__stat-value"]}>
                  {count?.friends}
                </strong>
              </li>
              <li className={styles["user-profile-modal__stat-item"]}>
                <span className={styles["user-profile-modal__stat-label"]}>
                  Posts
                </span>
                <strong className={styles["user-profile-modal__stat-value"]}>
                  {count?.posts}
                </strong>
              </li>
              <li className={styles["user-profile-modal__stat-item"]}>
                <span className={styles["user-profile-modal__stat-label"]}>
                  Comments
                </span>
                <strong className={styles["user-profile-modal__stat-value"]}>
                  {count?.comments}
                </strong>
              </li>
            </ul>
          ) : (
            <div className={styles["user-profile-modal__loader"]}>
              Loading stats...
            </div>
          )}
        </div>
      </div>

      {!isMyProfile && (
        <div className={styles["user-profile-modal__actions"]}>
          {actionsLoaded ? (
            <ActionsPanel companion={user} setCompanion={setUser}>
              <li>
                <Link
                  to={`/users/${user?.username || user?.id}`}
                  replace={true}
                  onClick={closeModal}
                  className="btn btn--secondary"
                >
                  To profile
                </Link>
              </li>
            </ActionsPanel>
          ) : (
            <div className={styles["user-profile-modal__loader"]}>
              Loading actions...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfileModal;
