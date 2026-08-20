import { getFullName, getCalendarTime } from "../utilis/helpers.js";
import { likePost } from "../api/functions/posts.js";
import Avatar from "./Avatar.jsx";
import LikeButton from "./LikeButton.jsx";

function PostCard({ post, is24h = true }) {
  const author = post?.author;
  const isLiked = post?.likedBy?.length > 0;
  const likesNumber = post?._count?.likedBy;
  const commentsNumber = post?._count?.comments;

  return (
    <div>
      <header>
        <Avatar user={author} showStatus={false} />
        <div>
          <span>{getFullName(author)}</span>
          <span>{getCalendarTime(post?.createdAt, is24h)}</span>
        </div>
      </header>
      <div>
        <p>{post?.content}</p>
      </div>
      <footer>
        <div>
          <LikeButton
            initialState={isLiked}
            likesNumber={likesNumber}
            onLike={() => {
              likePost(post?.id);
            }}
          />
        </div>
      </footer>
    </div>
  );
}

export default PostCard;
