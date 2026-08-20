import { RouterProvider } from "react-router/dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import router from "./routes.jsx";
import { DataProvider } from "./contexts/DataProvider.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <DataProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </AuthProvider>
    </DataProvider>
  </StrictMode>,
);
