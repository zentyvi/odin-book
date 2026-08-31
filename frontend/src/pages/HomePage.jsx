import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { getMyInfo } from "../api/functions/users.js";
import { useAuth } from "../contexts/AuthProvider.jsx";
import { useData } from "../contexts/DataProvider.jsx";
import { getFeed } from "../api/functions/posts.js";
import Loader from "../components/Loader";
import Header from "../features/header/Header.jsx";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const authContext = useAuth();
  const { setPosts, posts, mergePosts } = useData();

  useEffect(() => {
    if (authContext?.user) return;
    const main = async () => {
      try {
        const result = await getMyInfo();
        authContext?.setUser(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    main();
  }, [authContext]);

  useEffect(() => {
    const main = async () => {
      try {
        const feed = await getFeed();
        setPosts((prevPosts) => mergePosts(prevPosts, feed));
      } catch (err) {
        console.error(err);
      }
    };

    if (posts?.length === 0) {
      main();
    }

    const intervalId = setInterval(main, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div id="main-wrapper">
      <Header />
      <Outlet />
    </div>
  );
}

export default HomePage;
