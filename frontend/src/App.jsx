import { Outlet } from "react-router";
import GlobalModal from "./features/globalModal/GlobalModal.jsx";

function App() {
  return (
    <>
      <Outlet />
      <GlobalModal />
    </>
  );
}

export default App;
