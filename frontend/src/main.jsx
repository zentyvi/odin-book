import { RouterProvider } from "react-router/dom";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import { DataProvider } from "./contexts/DataProvider.jsx";
import { ModalProvider } from "./contexts/ModalProvider.jsx";

import router from "./routes.jsx";

const root = createRoot(document.getElementById("main-wrapper"));

root.render(
  <AuthProvider>
    <DataProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </GoogleOAuthProvider>
    </DataProvider>
  </AuthProvider>,
);
