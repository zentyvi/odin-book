import { Link } from "react-router";
import Avatar from "../../../../components/Avatar.jsx";
import { useAuth } from "../../../../contexts/AuthProvider.jsx";
import { getFullName } from "../../../../utilis/helpers.js";

function Chat({ chat }) {
  const { user } = useAuth();
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
        <Avatar user={companion} />
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
                {isMyMessage && (
                  <div>
                    {isRead ? (
                      <i className="bi bi-check-all" />
                    ) : (
                      <i className="bi bi-check" />
                    )}
                  </div>
                )}
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
