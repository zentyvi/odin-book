import { useEffect } from "react";
import { Outlet } from "react-router";
import { getMyInfo, getMySettings } from "../api/functions/users.js";
import { useAuth } from "../contexts/AuthProvider.jsx";
import { useData } from "../contexts/DataProvider.jsx";
import { getFeed } from "../api/functions/posts.js";
import {
  getMyLocalSettings,
  updateLocalSettings,
  mergeData,
} from "../utilis/helpers.js";
import Header from "../features/header/Header.jsx";
import Loader from "../components/Loader";

function HomePage() {
  const { user, setUser, guestMode, isAuthenticated } = useAuth();
  const { setPosts, posts, setSettings } = useData();
  const loading = (!guestMode && !user) || posts?.length === 0;

  useEffect(() => {
    const main = async () => {
      if ((isAuthenticated && user) || guestMode) return;
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
      }
    };
    main();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const main = async () => {
      try {
        const feed = await getFeed();
        setPosts((prevPosts) => mergeData(prevPosts, feed));
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
