import { createContext, useContext, useState } from "react";
import {
  filterData,
  getMyLocalSettings,
  updateLocalSettings,
} from "../utilis/helpers.js";
import { updateMySettings } from "../api/functions/users.js";
import { useAuth } from "./AuthProvider.jsx";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([]);
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

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
// eslint-disable-next-line
export const useData = () => useContext(DataContext);
