import Loader from "../../components/Loader.jsx";
import PostCard from "./PostCard.jsx";
import { useData } from "../../contexts/DataProvider.jsx";
import { useTitle } from "../../utilis/helpers.js";

function PostsFeed() {
  const { posts } = useData();
  useTitle("Home");
  const loading = posts?.length === 0;

  if (loading) {
    return <Loader />;
  }

  return (
    <main>
      <ul>
        {posts.map((p) => (
          <PostCard post={p} key={p.id} />
        ))}
      </ul>
    </main>
  );
}

export default PostsFeed;
