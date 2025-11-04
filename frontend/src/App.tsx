import { useState } from 'react';
import { useGetPostsQuery } from './generated/graphql';

function App() {
  const { loading, error, data } = useGetPostsQuery();
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading posts...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error.message}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Social Media Feed</h1>

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

            {/* Post Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #eee',
              paddingTop: '10px',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>❤️ {post.likeCount} likes</span>
              <button
                onClick={() => toggleComments(post._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '14px',
                  padding: '0',
                  textDecoration: 'none'
                }}
              >
                💬 {post.commentCount} comments {expandedComments.has(post._id) ? '▲' : '▼'}
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
              </div>
            )}
          </div>
        ))}

        {data?.posts?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No posts found
          </div>
        )}
      </div>
    </div>
  );
}

export default App
