import { useEffect } from "react";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import styles from "../../../styles/features/globalModal/notifications/Notification.module.css";

function Notification({ notification }) {
  const { removeNotification } = useModal();
  const { status, title, content, id, timeout } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, timeout);

    return () => clearTimeout(timer);
  }, [id, timeout, removeNotification]);

  const handleClose = () => {
    removeNotification(id);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "SUCCESS":
        return <i className="bi bi-check-circle-fill" aria-hidden="true" />;
      case "ERROR":
        return (
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
        );
      case "NEUTRAL":
      default:
        return <i className="bi bi-info-circle-fill" aria-hidden="true" />;
    }
  };

  const statusModifier =
    styles[`notification--${status?.toLowerCase() || "neutral"}`];

  return (
    <li
      className={`${styles.notification} ${statusModifier}`}
      aria-live="polite"
      style={{ "--timeout": `${timeout}ms` }}
    >
      <header className={styles.notification__header}>
        <div className={styles.notification__title_wrapper}>
          <span className={styles.notification__icon}>{getStatusIcon()}</span>
          <h5 className={styles.notification__title}>{title}</h5>
        </div>
        <button
          type="button"
          className={styles.notification__close_btn}
          aria-label="Close notification"
          onClick={handleClose}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      </header>

      {content && (
        <div className={styles.notification__content}>
          <p>{content}</p>
        </div>
      )}

      <div className={styles.notification__progress} />
    </li>
  );
}

export default Notification;
