import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import FocusLock from "react-focus-lock";
import {
  deletePost,
  getSinglePost,
  likePost,
} from "../../api/functions/posts.js";
import {
  getCalendarTime,
  getFullName,
  mergeData,
  useEscape,
  useTitle,
} from "../../utilis/helpers.js";
import { useData } from "../../contexts/DataProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";

import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";
import LikeButton from "../../components/LikeButton.jsx";
import PostComments from "./PostComments.jsx";
import styles from "../../styles/features/postView/SinglePostPage.module.css";

function SinglePostPage() {
  const { postId } = useParams();
  const { posts, likePostInCache, deletePostFromCache, setPosts, settings } =
    useData();
  const { openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();
  useTitle("Post");

  const post = posts.find((item) => item?.id === postId);

  const [loading, setLoading] = useState(!post);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEscape(() => setIsMenuOpen(false));

  const author = post?.author;
  const isLiked = post?.likedBy?.length > 0;
  const likesNumber = post?._count?.likedBy || 0;
  const isMyPost = author?.id === user?.id;

  /* Fetch fresh single post data and merge into global cache */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const freshPost = await getSinglePost(postId);
        setPosts((prevPosts) => mergeData(prevPosts, [freshPost]));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // eslint-disable-next-line
  }, [postId]);

  const handleLike = async () => {
    const result = await likePost(post.id);
    likePostInCache({ id: post.id, ...result });
    return result;
  };

  const handleDelete = async () => {
    try {
      if (!confirm("Are you sure that you want to delete this post?")) {
        return;
      }
      await deletePost(postId);
      deletePostFromCache(postId);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenProfile = () => {
    if (author) {
      openModal("USER_PREVIEW", author);
    }
  };

  if (loading && !post) {
    return (
      <main id="app-content" className={styles["single-post"]}>
        <div className={`content-wrapper ${styles["single-post__loader"]}`}>
          <Loader />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main id="app-content" className={styles["single-post"]}>
        <div className={`content-wrapper ${styles["single-post__not-found"]}`}>
          <p>Post not found</p>
        </div>
      </main>
    );
  }

  return (
    <main id="app-content">
      <div className="content-wrapper">
        <div className={styles["single-post__container"]}>
          <article className={styles["single-post__card"]}>
            <header className={styles["single-post__header"]}>
              <button
                type="button"
                className={styles["single-post__author-btn"]}
                aria-label="Open author's profile"
                onClick={handleOpenProfile}
              >
                <Avatar user={author} showStatus={false} />
              </button>

              <div className={styles["single-post__author-info"]}>
                <button
                  type="button"
                  className={styles["single-post__author-name-btn"]}
                  aria-label="Open author's profile"
                  onClick={handleOpenProfile}
                >
                  <span className={styles["single-post__author-name"]}>
                    {getFullName(author)}
                  </span>
                </button>
                <span className={styles["single-post__time"]}>
                  {getCalendarTime(post.createdAt, settings?.is24h)}
                </span>
              </div>

              {isMyPost && (
                <div className={styles["single-post__menu-wrapper"]}>
                  <button
                    type="button"
                    className={styles["single-post__menu-btn"]}
                    aria-label="Actions menu button"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    aria-controls="post-actions-menu"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <i className="bi bi-three-dots" aria-hidden="true" />
                  </button>

                  {isMenuOpen && (
                    <FocusLock>
                      <div
                        className={styles["single-post_backdrop"]}
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div
                        id="post-actions-menu"
                        className={styles["single-post__dropdown"]}
                      >
                        <ul className={styles["single-post__dropdown-list"]}>
                          <li className={styles["single-post__dropdown-item"]}>
                            <button
                              type="button"
                              className={styles["single-post__delete-btn"]}
                              aria-label="Delete post"
                              onClick={handleDelete}
                            >
                              <i className="bi bi-trash" aria-hidden="true" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </FocusLock>
                  )}
                </div>
              )}
            </header>

            <div className={styles["single-post__body"]}>
              {post?.content && (
                <div className={styles["single-post__text-wrapper"]}>
                  <p className={styles["single-post__text"]}>{post?.content}</p>
                </div>
              )}
              {post?.imageUrl && (
                <div className={styles["single-post__image-wrapper"]}>
                  <img
                    src={post?.imageUrl}
                    alt="Post attachment"
                    className={styles["single-post__image"]}
                  />
                </div>
              )}
            </div>

            <footer className={styles["single-post__footer"]}>
              <div className={styles["single-post__actions"]}>
                <LikeButton
                  initialState={isLiked}
                  likesNumber={likesNumber}
                  onLike={handleLike}
                />
              </div>
            </footer>
          </article>

          <PostComments comments={post?.comments} postId={postId} />
        </div>
      </div>
    </main>
  );
}

export default SinglePostPage;
