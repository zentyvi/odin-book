import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getChat } from "../../api/functions/chats.js";
import { filterData, useTitle } from "../../utilis/helpers.js";
import ChatHeader from "./components/ChatHeader.jsx";
import Loader from "../../components/Loader.jsx";
import MessagesFeed from "./components/messages/MessagesFeed.jsx";
import NewMessageForm from "./components/NewMessageForm.jsx";
import { useData } from "../../contexts/DataProvider.jsx";
import { deleteMessage } from "../../api/functions/messages.js";

function ChatPage() {
  const { username } = useParams();
  const { moveChatToFront, updateChatInCache, removeMessageFromCache } =
    useData();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const messages = chat?.messages || [];
  const companion = chat?.companion;
  const canTextThem = chat?.whoCanText === "EVERYONE" || chat?.areFriends;
  useTitle(companion?.username || "Chat");

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const result = await getChat(username);
        if (result?.id) {
          // check if has a chat id, so we know does the user have a chat with this user
          updateChatInCache(result);
        }
        setChat(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
    // eslint-disable-next-line
  }, [username]);

  const onMessageDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      removeMessageFromCache(chat.id, messageId);
      setChat((prev) => {
        return { ...prev, messages: filterData(prev.messages, messageId) };
      });
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
    setChat(updatedChat);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main>
      <ChatHeader chat={chat} />
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
    </main>
  );
}

export default ChatPage;
