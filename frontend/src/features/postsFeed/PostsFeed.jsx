import { useData } from "../../contexts/DataProvider.jsx";
import { useTitle } from "../../utilis/helpers.js";
import PostCard from "./PostCard.jsx";
import Loader from "../../components/Loader.jsx";
import styles from "../../styles/features/postsFeed/PostsFeed.module.css";

function PostsFeed() {
  const { posts } = useData();
  const loading = !posts;
  useTitle("Home");

  if (loading) {
    return (
      <main id="app-content">
        <div
          className={`content-wrapper ${styles["posts-feed__loader-wrapper"]}`}
        >
          <Loader />
        </div>
      </main>
    );
  }

  if (posts.length === 0) {
    return (
      <main id="app-content">
        <div className={`content-wrapper ${styles["posts-feed__empty"]}`}>
          <p className={styles["posts-feed__empty-text"]}>No posts yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="app-content">
      <div className={`content-wrapper ${styles["posts-feed__container"]}`}>
        <ul className={styles["posts-feed__list"]}>
          {posts.map((p) => (
            <PostCard post={p} key={p.id} />
          ))}
        </ul>
      </div>
    </main>
  );
}

export default PostsFeed;
