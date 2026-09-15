import { createContext, useContext, useEffect, useState } from "react";
import {
  filterData,
  getMyLocalSettings,
  mergeData,
  moveItemToFront,
  updateLocalSettings,
} from "../utilis/helpers.js";
import { updateMySettings } from "../api/functions/users.js";
import { useAuth } from "./AuthProvider.jsx";
import { socket } from "../api/connection.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [settings, setSettings] = useState(getMyLocalSettings());
  const { isAuthenticated } = useAuth();

  const updateSettings = async (newSettings) => {
    try {
      if (isAuthenticated) {
        await updateMySettings(newSettings);
      }
      updateLocalSettings(newSettings);
      setSettings((prev) => {
        return { ...prev, ...newSettings };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearDataCache = () => {
    setChats([]);
  };

  const likePostInCache = (updatedPostData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === updatedPostData.id) {
          return {
            ...post,
            likedBy: updatedPostData.isLiked ? [true] : [],
            _count: {
              ...post._count,
              likedBy: updatedPostData.likesCount,
            },
          };
        }
        return post;
      }),
    );
  };

  const updatePostInCache = (postId, freshData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (postId === post.id) {
          return { ...post, ...freshData };
        }
        return post;
      }),
    );
  };

  const deletePostFromCache = (postId) => {
    setPosts((prevPosts) => filterData(prevPosts, postId));
  };

  const likeCommentInCache = (updatedCommentData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (
          post.id === updatedCommentData.postId &&
          post?.comments !== undefined
        ) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === updatedCommentData.id) {
                return {
                  ...comment,
                  likedBy: updatedCommentData.isLiked ? [true] : [],
                  _count: {
                    ...comment._count,
                    likedBy: updatedCommentData.likesCount,
                  },
                };
              }
              return comment;
            }),
          };
        }
        return post;
      }),
    );
  };

  const addCommentInCache = (commentData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === commentData.postId) {
          return {
            ...post,
            comments: [{ ...commentData }, ...post.comments],
          };
        }
        return post;
      }),
    );
  };

  const deleteCommentFromCache = (postId, commentId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        const comments = post?.comments || [];
        if (post.id === postId) {
          return {
            ...post,
            comments: filterData(comments, commentId),
          };
        }
        return post;
      }),
    );
  };

  const getChatFromCache = (username_or_id) => {
    const chat = chats.find(
      (c) =>
        c?.companion?.username === username_or_id ||
        c?.companion?.id === username_or_id,
    );

    return chat || null;
  };

  const readChat = (chatId) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, unreadMessages: 0 };
        }
        return chat;
      }),
    );
  };

  const updateChatsInCache = (newChats) => {
    setChats((prev) => {
      return mergeData(prev, newChats);
    });
  };

  const updateChatInCache = (newChat) => {
    setChats((prev) => {
      let found = false;
      const newChats = prev.map((oldChat) => {
        if (oldChat.id === newChat.id) {
          found = true;
          return newChat;
        }
        return oldChat;
      });
      if (!found) {
        newChats.unshift(newChat);
      }
      return newChats;
    });
  };

  const moveChatToFront = (chatId) => {
    setChats((prev) => moveItemToFront(prev, chatId));
  };

  const removeChatFromCache = (chatId) => {
    setChats((prev) => filterData(prev, chatId));
  };

  const findChat = (chatId) => {
    return chats.find((chat) => chat.id === chatId);
  };

  const removeMessageFromCache = (chatId, messageId) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, messages: filterData(chat.messages, messageId) };
        }
        return chat;
      }),
    );
  };

  const _readMessages = (data) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === data.chatId) {
          const prevMessages = chat.messages || [];
          const newMessages = prevMessages.map((message) => {
            if (message?.authorId !== data?.userId) {
              return { ...message, isRead: true };
            }
            return message;
          });
          return { ...chat, messages: newMessages };
        }
        return chat;
      }),
    );
  };

  useEffect(() => {
    socket.on("new_message", (data) => {
      const { unreadMessages, chatId } = data;
      if (data.isNewChat) {
        updateChatInCache(data?.chat);
        return;
      }
      moveChatToFront(chatId);
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            const prevMessages = chat.messages || [];
            return {
              ...chat,
              messages: [...prevMessages, data],
              unreadMessages,
            };
          }
          return chat;
        }),
      );
    });

    socket.on("read_chat", (data) => {
      _readMessages(data);
    });

    socket.on("delete_message", (data) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === data.chatId) {
            const prevMessages = chat.messages || [];
            return {
              ...chat,
              messages: filterData(prevMessages, data.messageId),
            };
          }
          return chat;
        }),
      );
    });

    socket.on("update_status", (data) => {
      const { userId, isOnline, lastSeen } = data;
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.companion?.id === userId) {
            return {
              ...chat,
              companion: { ...chat.companion, isOnline, lastSeen },
            };
          }
          return chat;
        }),
      );
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        clearDataCache,
        posts,
        settings,
        setSettings,
        updateSettings,
        setPosts,
        likePostInCache,
        updatePostInCache,
        deletePostFromCache,
        likeCommentInCache,
        addCommentInCache,
        deleteCommentFromCache,
        chats,
        setChats,
        getChatFromCache,
        readChat,
        updateChatsInCache,
        updateChatInCache,
        moveChatToFront,
        removeChatFromCache,
        findChat,
        removeMessageFromCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
// eslint-disable-next-line
export const useData = () => useContext(DataContext);
