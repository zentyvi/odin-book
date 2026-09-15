import FocusLock from "react-focus-lock";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import { useEscape } from "../../../utilis/helpers.js";
import UserProfileModal from "./UserProfileModal.jsx";
import styles from "../../../styles/features/globalModal/GlobalModal.module.css";

function GlobalModal() {
  const { activeModal, closeModal } = useModal();
  useEscape(closeModal);

  if (!activeModal) return null;

  return (
    <FocusLock returnFocus>
      <div className={styles["modal-backdrop"]} onClick={closeModal}>
        <div
          className={styles["modal-container"]}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={styles["modal-close-btn"]}
            onClick={closeModal}
            aria-label="Close modal"
          >
            <span className={styles["modal-close-handle"]} />
            <i className={`bi bi-x-lg ${styles["modal-close-icon"]}`} />
          </button>

          <div className={styles["modal-content"]}>
            {activeModal?.type === "USER_PREVIEW" && (
              <UserProfileModal
                data={activeModal?.data}
                closeModal={closeModal}
              />
            )}
          </div>
        </div>
      </div>
    </FocusLock>
  );
}

export default GlobalModal;
