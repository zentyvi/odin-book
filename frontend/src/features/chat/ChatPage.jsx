import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getChat, markChatAsRead } from "../../api/functions/chats.js";
import { deleteMessage } from "../../api/functions/messages.js";
import { useTitle } from "../../utilis/helpers.js";
import { useData } from "../../contexts/DataProvider.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { socket } from "../../api/connection.js";
import ChatHeader from "./components/ChatHeader.jsx";
import MessagesFeed from "./components/messages/MessagesFeed.jsx";
import NewMessageForm from "./components/NewMessageForm.jsx";
import Loader from "../../components/Loader.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";

function ChatPage() {
  const { username } = useParams();
  const {
    moveChatToFront,
    updateChatInCache,
    removeChatFromCache,
    removeMessageFromCache,
    getChatFromCache,
  } = useData();
  const { isAuthenticated, user } = useAuth();
  const { sendNotification } = useModal();
  const chat = getChatFromCache(username);
  const [loading, setLoading] = useState(true);
  const messages = chat?.messages || [];
  const companion = chat?.companion;
  const canTextThem = chat?.whoCanText === "EVERYONE" || chat?.areFriends;
  const messagesRef = useRef();
  const navigate = useNavigate();
  useTitle(companion?.username || "Chat");

  useEffect(() => {
    if (
      !isAuthenticated ||
      username === user?.username ||
      username === user?.id
    ) {
      navigate("/", { replace: true });
    }
    const fetchChat = async () => {
      try {
        const result = await getChat(username);
        updateChatInCache(result);
        if (result?.id) {
          // check if has a chat id, so we know does the user have a chat with this user
          await markChatAsRead(username);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleRead = async () => {
      await markChatAsRead(username);
    };

    socket.on("new_message", handleRead);

    const handleDeleteChat = (data) => {
      if (data.username === username) {
        navigate("/", { replace: true });
        sendNotification(
          "Error",
          "Your companion has deleted this chat",
          "ERROR",
        );
      }
      removeChatFromCache(data.chatId);
    };

    socket.on("delete_chat", handleDeleteChat);

    fetchChat();
    return () => {
      socket.off("new_message", handleRead);
      socket.off("delete_chat", handleDeleteChat);
    };
    // eslint-disable-next-line
  }, [username]);

  /* Automatically scroll to the latest message when messages update */
  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const onMessageDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      removeMessageFromCache(chat.id, messageId);
    } catch (err) {
      console.error(err);
    }
  };

  const onMessageSend = (message) => {
    const lastMessages = chat?.messages || [];
    const newMessages = [...lastMessages, ...[message]];
    const updatedChat = {
      ...chat,
      messages: newMessages,
      id: message?.chatId,
    };

    updateChatInCache(updatedChat);
    moveChatToFront(updatedChat.id);
  };

  return (
    <main>
      {companion && <ChatHeader chat={chat} />}
      {loading ? (
        <Loader />
      ) : (
        <>
          <MessagesFeed
            messages={messages}
            companion={companion}
            onMessageDelete={onMessageDelete}
          />
          <NewMessageForm
            companion={companion}
            canTextThem={canTextThem}
            onMessageSend={onMessageSend}
          />
        </>
      )}
      {/* Invisible anchor element for auto-scrolling */}
      <div ref={messagesRef} />{" "}
    </main>
  );
}

export default ChatPage;
