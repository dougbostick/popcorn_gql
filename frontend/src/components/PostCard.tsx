import { useLikePostMutation, useUnlikePostMutation, type GetFeedQuery } from '../generated/graphql';

type FeedPost = GetFeedQuery['feed'][0];

interface PostCardProps {
  post: FeedPost;
}

export function PostCard({ post }: PostCardProps) {
  const [likePost] = useLikePostMutation({
    refetchQueries: ['GetFeed'],
  });

  const [unlikePost] = useUnlikePostMutation({
    refetchQueries: ['GetFeed'],
  });

  const handleLikeToggle = async () => {
    try {
      if (post.isLikedByMe) {
        await unlikePost({
          variables: { postId: post._id }
        });
      } else {
        await likePost({
          variables: { postId: post._id }
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {post.author.displayName[0]}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">{post.author.displayName}</h3>
          <p className="text-sm text-gray-500">@{post.author.username}</p>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          {new Date(parseInt(post.createdAt)).toLocaleDateString()}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4">
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              post.isLikedByMe
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <svg
              className={`w-5 h-5 ${post.isLikedByMe ? 'fill-current' : 'stroke-current'}`}
              fill={post.isLikedByMe ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">{post.likeCount}</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium">{post.commentCount}</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}