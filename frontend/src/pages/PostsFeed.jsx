import { useOutletContext } from "react-router";
import Loader from "../components/Loader.jsx";
import PostCard from "../components/PostCard.jsx";

function PostsFeed() {
  const { posts, options } = useOutletContext();
  const loading = posts?.length === 0;

  if (loading) {
    return <Loader />;
  }

  return (
    <main>
      <div>
        {posts.map((p) => (
          <PostCard post={p} key={p.id} is24h={options?.is24h} />
        ))}
      </div>
    </main>
  );
}

export default PostsFeed;
