import Loader from "../../components/Loader.jsx";
import PostCard from "../postsFeed/PostCard.jsx";
import Comment from "../postView/Comment.jsx";
import FriendRequestItem from "./FriendRequestItem.jsx";
import styles from "../../styles/features/profileView/UserProfileItems.module.css";

function UserProfileItems({ type, data, setUser, isMyProfile }) {
  const loading = typeof data === "undefined";

  if (loading) {
    return <Loader />;
  }

  const prefix = isMyProfile ? "You haven't" : "This user hasn't";

  let items;
  let message;
  switch (type) {
    case "POSTS":
      message = `${prefix} written any posts yet`;
      items = data.map((p) => <PostCard key={p.id} post={p} isMyPost={true} />);
      break;
    case "COMMENTS":
      message = `${prefix} written any comments yet`;
      items = data.map((c) => (
        <Comment key={c.id} comment={c} includeNavigation={true} />
      ));
      break;
    case "REQUESTS":
      message = "You don't have any friend requests now 🫤";
      items = data.map((r) => (
        <FriendRequestItem key={r.id} request={r} setUser={setUser} />
      ));
      break;
  }

  return (
    <section className={styles["profile-items"]}>
      {items?.length > 0 ? (
        <ul className={styles["profile-items__list"]}>{items}</ul>
      ) : (
        <div className={styles["profile-items__empty"]}>
          <h2>There is nothing</h2>
          <p>{message}</p>
        </div>
      )}
    </section>
  );
}

export default UserProfileItems;
