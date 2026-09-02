import { useModal } from "../../../contexts/ModalProvider.jsx";
import Notification from "./Notification.jsx";

function Notifications() {
  const { notifications } = useModal();

  if (notifications?.length > 0) {
    return (
      <div>
        <ul>
          {notifications.map((n) => (
            <Notification notification={n} key={n.id} />
          ))}
        </ul>
      </div>
    );
  }
}

export default Notifications;
