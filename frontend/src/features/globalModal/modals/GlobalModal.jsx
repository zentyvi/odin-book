import FocusLock from "react-focus-lock";
import { useModal } from "../../../contexts/ModalProvider.jsx";
import UserProfileModal from "./UserProfileModal.jsx";
import { useEscape } from "../../../utilis/helpers.js";

function GlobalModal() {
  const { activeModal, closeModal } = useModal();
  useEscape(closeModal);

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
