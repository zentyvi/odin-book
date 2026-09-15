import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getChat, markChatAsRead } from "../../api/functions/chats.js";
import { deleteMessage } from "../../api/functions/messages.js";
import { useTitle } from "../../utilis/helpers.js";
import { useData } from "../../contexts/DataProvider.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";
import { socket } from "../../api/connection.js";
import { useModal } from "../../contexts/ModalProvider.jsx";
import ChatHeader from "./components/ChatHeader.jsx";
import MessagesFeed from "./components/messages/MessagesFeed.jsx";
import NewMessageForm from "./components/NewMessageForm.jsx";
import Loader from "../../components/Loader.jsx";
import "../../styles/features/chat/ChatPage.css";

function ChatPage() {
  const { username } = useParams();
  const {
    moveChatToFront,
    updateChatInCache,
    removeChatFromCache,
    removeMessageFromCache,
    getChatFromCache,
    readChat,
  } = useData();
  const { isAuthenticated, user } = useAuth();
  const { sendNotification } = useModal();
  const [loading, setLoading] = useState(true);
  const chat = getChatFromCache(username);
  const messages = chat?.messages || [];
  const companion = chat?.companion;
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
          readChat(result?.id);
          await markChatAsRead(username);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const handleRead = async (data) => {
      readChat(data.chatId);
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
    <main id="app-content" className="chat-page">
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
          <NewMessageForm chat={chat} onMessageSend={onMessageSend} />
        </>
      )}
    </main>
  );
}

export default ChatPage;
