import { useEffect, useState } from "react";
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
import { register_user } from "../api/connection.js";
import { SidebarProvider } from "../contexts/SidebarProvider.jsx";
import Header from "../features/header/Header.jsx";
import Loader from "../components/Loader";
import SidebarWrapper from "../features/sidebar/SidebarWrapper.jsx";

function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, setUser, guestMode, isAuthenticated, logout } = useAuth();
  const { setPosts, posts, setSettings, clearDataCache } = useData();
  const loading = (!guestMode && !user) || posts?.length === 0;

  useEffect(() => {
    if (isAuthenticated && user) {
      register_user(user?.id);
    }
    // eslint-disable-next-line
  }, [isAuthenticated, isMounted]);

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
          const actualSettings = await getMySettings();
          updateLocalSettings(actualSettings);
          setSettings(actualSettings);
        }

        setUser(result);
      } catch (err) {
        if (err.action === "DELETE_TOKEN") {
          logout();
          clearDataCache();
        }
        console.error(err);
      } finally {
        setIsMounted(true);
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
    <SidebarProvider>
      <Header />
      <div id="app-wrapper">
        <SidebarWrapper />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}

export default HomePage;
