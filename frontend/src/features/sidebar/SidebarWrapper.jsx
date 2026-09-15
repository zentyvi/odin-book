import FocusLock from "react-focus-lock";
import { useSidebar } from "../../contexts/SidebarProvider.jsx";
import { useEscape } from "../../utilis/helpers.js";
import Sidebar from "./Sidebar.jsx";
import styles from "../../styles/features/sidebar/Sidebar.module.css";

function SidebarWrapper() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  useEscape(closeSidebar);

  return (
    <>
      {isSidebarOpen && (
        <div className={styles["overlay"]} onClick={closeSidebar} />
      )}
      <FocusLock disabled={!isSidebarOpen}>
        <Sidebar
          onClose={isSidebarOpen ? closeSidebar : undefined}
          key="sidebar"
        />
      </FocusLock>
    </>
  );
}

export default SidebarWrapper;
