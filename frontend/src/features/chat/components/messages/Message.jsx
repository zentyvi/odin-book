import FocusLock from "react-focus-lock";
import { getCalendarTime, getShortTime } from "../../../../utilis/helpers.js";
import { useData } from "../../../../contexts/DataProvider.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";

function Message({
  onMessageDelete,
  openContextMenu,
  closeContextMenu,
  activeContextMenu,
  message,
}) {
  const { settings } = useData();
  const { user } = useAuth();
  const isMyMessage = message?.authorId === user?.id;
  const isContextMenuOpen = activeContextMenu === message.id;
  const { isRead } = message;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    closeContextMenu();
  };

  const handleDelete = async () => {
    try {
      if (
        !confirm(
          "Are you sure that you want to delete this message for both sides?",
        )
      ) {
        return;
      }
      closeContextMenu();
      await onMessageDelete(message.id);
    } catch (err) {
      console.error(err);
    }
  };

  const acionsMenu = (
    <FocusLock>
      <div onClick={closeContextMenu}>
        <div onClick={(e) => e.stopPropagation()}>
          <ul>
            <li>
              <button onClick={handleCopy}>Copy</button>
            </li>
            <li>
              <button onClick={handleDelete}>Delete</button>
            </li>
          </ul>
        </div>
      </div>
    </FocusLock>
  );

  return (
    <li
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu(message.id);
      }}
    >
      <div>
        <p>{message?.content}</p>
        <div>
          <span title={getCalendarTime(message?.createdAt, settings.is24h)}>
            {getShortTime(message?.createdAt, settings.is24h)}
          </span>
          {isMyMessage && (
            <div>
              {isRead ? (
                <i className="bi bi-check-all" />
              ) : (
                <i className="bi bi-check" />
              )}
            </div>
          )}
        </div>
      </div>
      {isContextMenuOpen && acionsMenu}
    </li>
  );
}

export default Message;
