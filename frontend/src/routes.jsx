import { createBrowserRouter } from "react-router";
import App from "./App";
import GuestRoute from "./components/GuestRoute";

import SignUpForm from "./pages/SignUpForm";
import LogInForm from "./pages/LogInForm";
import GithubLogInpage from "./pages/GithubLogInPage";

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
    ],
  },
]);

export default router;
