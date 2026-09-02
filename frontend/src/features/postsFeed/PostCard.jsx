import { Link } from "react-router";
import { getFullName, getCalendarTime } from "../../utilis/helpers.js";
import { likePost } from "../../api/functions/posts.js";
import { useData } from "../../contexts/DataProvider.jsx";
import { useModal } from "../../contexts/ModalProvider.jsx";
import Avatar from "../../components/Avatar.jsx";
import LikeButton from "../../components/LikeButton.jsx";

function PostCard({ post }) {
  const author = post?.author;
  const isLiked = post?.likedBy?.length > 0;
  const likesNumber = post?._count?.likedBy;
  const commentsNumber = post?._count?.comments;
  const { likePostInCache, settings } = useData();
  const { openModal } = useModal();

  const handleLike = async () => {
    const result = await likePost(post.id);
    likePostInCache({ id: post.id, ...result });
    return result;
  };

  return (
    <li>
      <article>
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
            <span>{getCalendarTime(post?.createdAt, settings?.is24h)}</span>
          </div>
        </header>
        <main>
          <Link to={`/posts/${post.id}#`} aria-label="To post" state={post}>
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
          </Link>
        </main>
        <footer>
          <div>
            <LikeButton
              initialState={isLiked}
              likesNumber={likesNumber}
              onLike={handleLike}
            />
            <div>
              <Link
                to={`/posts/${post.id}#comments`}
                aria-label="To comments"
                state={post}
              >
                <i className="bi bi-chat-fill" />
              </Link>
              <span aria-label="Comments number">{commentsNumber}</span>
            </div>
          </div>
        </footer>
      </article>
    </li>
  );
}

export default PostCard;
