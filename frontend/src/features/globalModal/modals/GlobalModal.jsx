import { useEffect } from "react";
import FocusLock from "react-focus-lock";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import UserProfileModal from "./UserProfileModal.jsx";

function GlobalModal() {
  const { activeModal, closeModal } = useModal();
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  });

  return (
    <>
      {activeModal && (
        <FocusLock>
          <div>
            <button onClick={closeModal}>CLOSE</button>
          </div>
          {activeModal?.type === "USER_PREVIEW" && (
            <UserProfileModal
              data={activeModal?.data}
              closeModal={closeModal}
            />
          )}
        </FocusLock>
      )}
    </>
  );
}

export default GlobalModal;
