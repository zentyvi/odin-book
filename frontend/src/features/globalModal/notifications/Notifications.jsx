import { useModal } from "../../../contexts/ModalProvider.jsx";
import Notification from "./Notification.jsx";
import styles from "../../../styles/features/globalModal/notifications/Notifications.module.css";

function Notifications() {
  const { notifications } = useModal();

  if (!notifications || notifications.length === 0) return null;

  const newsToOlder = [...notifications].reverse();

  return (
    <div className={styles["notifications"]}>
      <ul className={styles["notifications-list"]}>
        {newsToOlder.map((n) => (
          <Notification notification={n} key={n.id} />
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
