import Loader from "../../components/Loader.jsx";
import PostCard from "./PostCard.jsx";
import { useData } from "../../contexts/DataProvider.jsx";

function PostsFeed() {
  const { posts } = useData();
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
