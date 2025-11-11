import { useState } from 'react';
import { useGetPostsQuery, useLikePostMutation, useUnlikePostMutation, useAddCommentMutation } from '../generated/graphql';
import { CreatePost } from './CreatePost';

export function MainFeed() {
  const { loading, error, data } = useGetPostsQuery();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const [likePost] = useLikePostMutation({
    refetchQueries: ['GetPosts'],
  });

  const [unlikePost] = useUnlikePostMutation({
    refetchQueries: ['GetPosts'],
  });

  const [addComment] = useAddCommentMutation({
    refetchQueries: ['GetPosts'],
  });

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost({ variables: { postId } });
      } else {
        await likePost({ variables: { postId } });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await addComment({
        variables: {
          input: {
            postId,
            content
          }
        }
      });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      Loading posts...
    </div>
  );

  if (error) return (
    <div style={{
      padding: '20px',
      color: 'red',
      textAlign: 'center'
    }}>
      Error: {error.message}
    </div>
  );

  return (
    <div style={{
      maxWidth: '600px',
      margin: '20px auto',
      padding: '0 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Create Post */}
      <CreatePost />

      {/* Posts Feed */}
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {data?.posts?.map((post) => (
            <div key={post._id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {/* Author Info */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#4267B2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}>
                  {post.author.displayName[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{post.author.displayName}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>@{post.author.username}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: '#666', fontSize: '14px' }}>
                  {new Date(parseInt(post.createdAt)).toLocaleDateString()}
                </div>
              </div>

              {/* Post Content */}
              <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{post.title}</h2>
              <p style={{ margin: '0 0 15px 0', lineHeight: '1.5' }}>{post.content}</p>

              {/* Post Image */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '15px'
                  }}
                />
              )}

              {/* Post Actions */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderTop: '1px solid #e4e6eb',
                borderBottom: '1px solid #e4e6eb',
                padding: '4px 0',
                marginTop: '12px'
              }}>
                <button
                  onClick={() => handleLike(post._id, post.isLikedByMe)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: post.isLikedByMe ? '#4267B2' : '#65676b',
                    fontSize: '15px',
                    fontWeight: post.isLikedByMe ? '600' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {post.isLikedByMe ? '❤️' : '🤍'} Like ({post.likeCount})
                </button>
                <button
                  onClick={() => toggleComments(post._id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    color: '#65676b',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  💬 Comment ({post.commentCount})
                </button>
              </div>

              {/* Comments Section - Accordion Style */}
              {expandedComments.has(post._id) && (
                <div style={{
                  marginTop: '15px',
                  borderTop: '1px solid #eee',
                  paddingTop: '15px'
                }}>
                  {post.comments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {post.comments.map((comment) => (
                        <div key={comment._id} style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '10px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '8px'
                        }}>
                          {/* Comment Author Avatar */}
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#4267B2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            {comment.author.displayName[0]}
                          </div>

                          {/* Comment Content */}
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 'bold',
                              fontSize: '13px',
                              marginBottom: '2px'
                            }}>
                              {comment.author.displayName}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              lineHeight: '1.4',
                              marginBottom: '4px'
                            }}>
                              {comment.content}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#888'
                            }}>
                              {new Date(parseInt(comment.createdAt)).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      color: '#888',
                      fontSize: '14px',
                      padding: '20px'
                    }}>
                      No comments yet. Be the first to comment!
                    </div>
                  )}

                  {/* Add Comment Form */}
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e4e6eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post._id);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          fontSize: '14px',
                          border: '1px solid #ccc',
                          borderRadius: '20px',
                          outline: 'none',
                          backgroundColor: '#f0f2f5'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#4267B2'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        disabled={!commentInputs[post._id]?.trim()}
                        style={{
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          border: 'none',
                          borderRadius: '20px',
                          backgroundColor: commentInputs[post._id]?.trim() ? '#4267B2' : '#e4e6eb',
                          color: commentInputs[post._id]?.trim() ? 'white' : '#bcc0c4',
                          cursor: commentInputs[post._id]?.trim() ? 'pointer' : 'not-allowed',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {data?.posts?.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>No posts found</h3>
              <p style={{ margin: 0 }}>
                Check back later for new posts from your friends!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}