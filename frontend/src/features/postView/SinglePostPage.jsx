import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  deletePost,
  getSinglePost,
  likePost,
} from "../../api/functions/posts.js";
import { getCalendarTime, getFullName } from "../../utilis/helpers.js";
import { useData } from "../../contexts/DataProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";

import Loader from "../../components/Loader.jsx";
import Avatar from "../../components/Avatar.jsx";
import LikeButton from "../../components/LikeButton.jsx";
import PostComments from "./PostComments.jsx";
import { useAuth } from "../../contexts/AuthProvider.jsx";

function SinglePostPage() {
  const { postId } = useParams();
  const {
    posts,
    likePostInCache,
    deletePostFromCache,
    setPosts,
    mergePosts,
    settings,
  } = useData();
  const { openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  const post = posts.find((item) => item?.id === postId);

  const [loading, setLoading] = useState(!post);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const author = post?.author;
  const isLiked = post?.likedBy?.length > 0;
  const likesNumber = post?._count?.likedBy;
  const isMyPost = author?.id === user?.id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const freshPost = await getSinglePost(postId);

        setPosts((prevPosts) => mergePosts(prevPosts, [freshPost]));
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

  if (loading && !post) {
    return <Loader />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main>
      <div>
        <div>
          <header>
            <button
              aria-label="open author's profile"
              onClick={() => openModal("USER_PREVIEW", author)}
            >
              <Avatar user={author} showStatus={false} />
            </button>
            <div>
              <button
                aria-label="open author's profile"
                onClick={() => openModal("USER_PREVIEW", author)}
              >
                <span>{getFullName(author)}</span>
              </button>
              <span>{getCalendarTime(post.createdAt, settings?.is24h)}</span>
            </div>
            {isMyPost && (
              <div>
                <button
                  aria-label="Actions menu button"
                  aria-expanded={isMenuOpen}
                  aria-controls="post-actions-menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <i className="bi bi-list" />
                </button>
                {isMenuOpen && (
                  <div>
                    <div>
                      <ul>
                        <li>
                          <button
                            aria-label="Delete post"
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </header>
          <main>
            {post?.content && (
              <div>
                <p>{post?.content}</p>
              </div>
            )}
            {post?.imageUrl && (
              <div>
                <img src={post?.imageUrl} alt="Post image" />
              </div>
            )}
          </main>
          <footer>
            <div>
              <LikeButton
                initialState={isLiked}
                likesNumber={likesNumber}
                onLike={handleLike}
              />
            </div>
          </footer>
        </div>
      </div>
      <PostComments comments={post?.comments} postId={postId} />
    </main>
  );
}

export default SinglePostPage;
