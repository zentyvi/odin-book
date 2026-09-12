import { useState, useRef } from "react";
import { sendMessage } from "../../../api/functions/chats.js";
import { useAuth } from "../../../contexts/AuthProvider.jsx";
const styles = {};

function NewMessageForm({ chat, onMessageSend }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const formattedMessage = message.trim();
  const textareaRef = useRef(null);
  const companion = chat?.companion;
  const canTextThem = chat?.whoCanText === "EVERYONE" || chat?.areFriends;

  const username = companion?.username || "user";

  const hasMessage = formattedMessage.length > 0;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (formattedMessage.length === 0) return;

    try {
      const result = await sendMessage(
        companion?.username || companion?.id,
        formattedMessage,
      );
      onMessageSend({
        id: result.id,
        createdAt: result.createdAt,
        content: formattedMessage,
        imageUrl: null,
        authorId: user?.id,
        chatId: result?.chatId,
      });
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Handle Enter key press to send, Shift + Enter for a new line */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* Auto-grow textarea height based on content length */
  const handleInput = (e) => {
    setMessage(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <form className={styles["message-form"]} onSubmit={handleSubmit}>
      {!canTextThem && (
        <div>
          <span>This user has restricted who can send messages to them.</span>
        </div>
      )}
      <div className={styles["message-form__field-wrapper"]}>
        <textarea
          id="message"
          ref={textareaRef}
          className={styles["message-form__textarea"]}
          placeholder={`Message @${username}...`}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          required
          disabled={!canTextThem}
          autoComplete="off"
        />

        <button
          type="submit"
          className={styles["message-form__submit-btn"]}
          aria-label="Send message"
          disabled={!canTextThem || !hasMessage}
        >
          <i
            className={`bi bi-send-fill ${styles["message-form__icon"]}`}
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </form>
  );
}

export default NewMessageForm;
