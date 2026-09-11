import { useEffect } from "react";
import { useModal } from "../../../contexts/ModalProvider.jsx";

function Notification({ notification }) {
  const { removeNotification } = useModal();
  const { status, title, content, id, timeout } = notification;
  let icon;
  switch (status) {
    case "NETURAL":
      icon = null;
      break;
    case "SUCCESS":
      icon = "✅";
      break;
    case "ERROR":
      icon = "⚠️";
      break;
  }

  useEffect(() => {
    setTimeout(() => {
      removeNotification(id);
    }, timeout);

    // eslint-disable-next-line
  }, []);

  const handleClose = () => {
    removeNotification(id);
  };

  return (
    <li aria-live="polite" style={{ animationDuration: timeout }}>
      <header>
        <div>
          {icon && <span aria-hidden={true}>{icon}</span>}
          <h5>{title}</h5>
        </div>
        <button aria-label="Close notification" onClick={handleClose}>
          <i className="bi bi-x-lg" />
        </button>
      </header>
      <main>
        <p>{content}</p>
      </main>
    </li>
  );
}

export default Notification;
