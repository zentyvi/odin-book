import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import SignUpForm from "./pages/SignUpForm";
import LogInForm from "./pages/LogInForm";
import GithubLogInpage from "./pages/GithubLogInPage";

import HomePage from "./pages/HomePage.jsx";
import PostsFeed from "./pages/PostsFeed.jsx";

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
          { path: "auth/github", element: <GithubLogInpage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            index: true,
            element: <Navigate to="/home" replace={true} />,
          },
          {
            path: "/home",
            element: <HomePage />,
            children: [{ index: true, element: <PostsFeed /> }],
          },
        ],
      },
    ],
  },
]);

export default router;
