import { Outlet } from "react-router";
import GlobalModal from "./features/globalModal/modals/GlobalModal.jsx";
import Notifications from "./features/globalModal/notifications/Notifications.jsx";
import "./styles/index.css";

function App() {
  return (
    <>
      <Outlet />
      <GlobalModal />
      <Notifications />
    </>
  );
}

export default App;
