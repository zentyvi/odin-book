import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import SignUpForm from "./pages/SignUpForm";
import LogInForm from "./pages/LogInForm";
import GithubLogInPage from "./pages/GithubLogInPage";

import HomePage from "./pages/HomePage.jsx";
import PostsFeed from "./features/postsFeed/PostsFeed.jsx";
import FriendsPage from "./features/friendsView/FriendsPage.jsx";
import CreatePostPage from "./features/create/CreatePostPage.jsx";
import UserProfilePage from "./features/profileView/UserProfilePage.jsx";
import SinglePostPage from "./features/postView/SinglePostPage.jsx";
import ProfileEditPage from "./features/profileEdit/ProfileEditPage.jsx";
import SearchPage from "./features/search/searchPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: "auth/sign-up", element: <SignUpForm /> },
          { path: "auth/log-in", element: <LogInForm /> },
          { path: "auth/github", element: <GithubLogInPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/home",
            element: <Navigate to="/" replace={true} />,
          },
          {
            path: "/",
            element: <HomePage />,
            children: [
              { path: "/", element: <PostsFeed /> },
              { path: "/posts/:postId", element: <SinglePostPage /> },
              { path: "/users/:username", element: <UserProfilePage /> },
              { path: "/create/post", element: <CreatePostPage /> },
              { path: "/friends", element: <FriendsPage /> },
              { path: "/me/edit", element: <ProfileEditPage /> },
              { path: "/search/users", element: <SearchPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
