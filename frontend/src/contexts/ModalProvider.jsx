import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const sendNotification = (
    title,
    content,
    status = "NETURAL",
    timeout = 3000,
  ) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => {
      return [...prev, { id, title, content, status, timeout }];
    });

    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const openModal = (type, data = null) => {
    setActiveModal({ type, data });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <ModalContext.Provider
      value={{
        notifications,
        sendNotification,
        removeNotification,
        activeModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line
export const useModal = () => useContext(ModalContext);
