import { Link } from "react-router";
import Avatar from "../../../../components/Avatar.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import {
  getCalendarTime,
  getFullName,
  getShortTime,
} from "../../../../utilis/helpers.js";
import { useData } from "../../../../contexts/DataProvider.jsx";

function Chat({ chat }) {
  const { user } = useAuth();
  const { settings } = useData();
  const { companion, messages } = chat;
  const lastMessage =
    typeof messages !== "undefined" ? messages[messages.length - 1] : null;
  const isRead = lastMessage?.isRead;
  const isMyMessage = lastMessage?.authorId === user?.id;
  const hasImage = Boolean(lastMessage?.imageUrl);
  const hasContent = Boolean(lastMessage?.content);

  const previewMessage = (
    <>
      {hasImage ? (
        <span aria-label="Message has an attached image">
          <i className="bi bi-image" aria-hidden={true} />
        </span>
      ) : (
        ""
      )}
      {hasContent ? (
        <span aria-label="Last message">{lastMessage?.content}</span>
      ) : (
        ""
      )}
    </>
  );

  return (
    <li>
      <Link to={`/chats/${companion?.username || companion?.id}`}>
        <Avatar user={companion} showStatus={true} />
        <div>
          <header>
            <div>
              <h3>{getFullName(companion)}</h3>
            </div>
            {lastMessage && (
              <div>
                <span aria-label="Last message was sent at"></span>
              </div>
            )}
          </header>
          <main>
            {hasContent || hasImage ? (
              <>
                <div>{previewMessage}</div>
                <div>
                  <span
                    title={getCalendarTime(
                      lastMessage?.createdAt,
                      settings?.is24h,
                    )}
                  >
                    {getShortTime(lastMessage?.createdAt, settings?.is24h)}
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
              </>
            ) : (
              <i>No messages yet</i>
            )}
          </main>
        </div>
      </Link>
    </li>
  );
}

export default Chat;
