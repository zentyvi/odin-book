import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { getMyInfo, getMySettings } from "../api/functions/users.js";
import { useAuth } from "../contexts/AuthProvider.jsx";
import { useData } from "../contexts/DataProvider.jsx";
import { getFeed } from "../api/functions/posts.js";
import Loader from "../components/Loader";
import Header from "../features/header/Header.jsx";
import { getMyLocalSettings, updateLocalSettings } from "../utilis/helpers.js";

function HomePage() {
  const { user, setUser, isAuthenticated } = useAuth();
  const { setPosts, posts, mergePosts, setSettings } = useData();
  const [loading, setLoading] = useState(
    (isAuthenticated && !user) || posts?.length === 0,
  );

  useEffect(() => {
    if (user) return;
    const main = async () => {
      try {
        const result = await getMyInfo();
        const localSettings = getMyLocalSettings();
        if (
          !localSettings ||
          result?.settings?.updatedAt !== localSettings?.updatedAt
        ) {
          const newSettings = await getMySettings();
          updateLocalSettings(newSettings);
          setSettings(newSettings);
        }
        setUser(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    main();
    // eslint-disable-next-line
  }, []);

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
