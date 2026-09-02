import { createContext, useContext, useState } from "react";
import { getMySettings, updateLocalSettings } from "../utilis/helpers.js";
import { updateMySettings } from "../api/functions/users.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState(getMySettings());

  const updateSettings = async (newSettings) => {
    try {
      await updateMySettings(newSettings);
      updateLocalSettings(newSettings);
      setSettings((prev) => {
        return { ...prev, ...newSettings };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const mergePosts = (existingPosts, newPosts) => {
    const postsMap = new Map();

    existingPosts.forEach((post) => {
      postsMap.set(post.id, post);
    });

    newPosts.forEach((newPost) => {
      const id = newPost.id;
      const existing = postsMap.get(id);

      if (existing) {
        const hasMoreComments =
          (existing.comments?.length || 0) > (newPost.comments?.length || 0);

        postsMap.set(id, {
          ...existing,
          ...newPost,
          comments: hasMoreComments
            ? existing.comments
            : newPost.comments || existing.comments,
        });
      } else {
        postsMap.set(id, newPost);
      }
    });

    return Array.from(postsMap.values());
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
        if (post.id === postId) {
          if (typeof post.comments === "undefined") return;
          return {
            ...post,
            comments: post?.comments?.filter((c) => c.id !== commentId),
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
        setPosts,
        mergePosts,
        likePostInCache,
        updatePostInCache,
        likeCommentInCache,
        addCommentInCache,
        deleteCommentFromCache,
        settings,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
// eslint-disable-next-line
export const useData = () => useContext(DataContext);
