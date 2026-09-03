import Loader from "../../components/Loader.jsx";
import PostCard from "../postsFeed/PostCard.jsx";
import Comment from "../postView/Comment.jsx";
import FriendRequestItem from "./FriendRequestItem.jsx";

const style = {};

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
    <main className={style[`profile__${type.toLowerCase()}`]}>
      {items?.length > 0 ? (
        <ul>{items}</ul>
      ) : (
        <div className={style["profile__empty"]}>
          <h2>There is nothing</h2>
          <p>{message}</p>
        </div>
      )}
    </main>
  );
}

export default UserProfileItems;
