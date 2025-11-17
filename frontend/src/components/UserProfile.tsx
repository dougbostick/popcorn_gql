import { useParams } from 'react-router-dom';
import { useGetUserQuery } from '../generated/graphql';

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { loading, error, data } = useGetUserQuery({
    variables: { _id: userId! },
    skip: !userId
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #4267B2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{ color: '#666' }}>Loading profile...</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        color: 'red',
        textAlign: 'center'
      }}>
        Error loading profile: {error.message}
      </div>
    );
  }

  const user = data?.user;

  if (!user) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center'
      }}>
        User not found
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Cover Photo Area */}
      <div style={{
        backgroundColor: '#fff',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Cover Photo */}
        <div style={{
          height: '350px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}>
          {/* Profile Picture */}
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '168px',
            height: '168px',
            borderRadius: '50%',
            border: '4px solid white',
            backgroundColor: '#4267B2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.displayName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              user.displayName[0].toUpperCase()
            )}
          </div>
        </div>

        {/* Profile Info Section */}
        <div style={{
          paddingTop: '75px',
          paddingBottom: '16px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 0 4px 0',
            color: '#050505'
          }}>
            {user.displayName}
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#65676b',
            margin: '0 0 16px 0'
          }}>
            @{user.username}
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            paddingTop: '12px',
            borderTop: '1px solid #e4e6eb',
            maxWidth: '600px',
            margin: '0 auto',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#050505'
              }}>
                {user.postCount}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#65676b'
              }}>
                Posts
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#050505'
              }}>
                {user.followerCount}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#65676b'
              }}>
                Followers
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#050505'
              }}>
                {user.followingCount}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#65676b'
              }}>
                Following
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div style={{
        maxWidth: '900px',
        margin: '16px auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: '16px'
        }}>
          {/* Left Column - About */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 16px 0',
                color: '#050505'
              }}>
                About
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e4e6eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{
                      fontSize: '15px',
                      color: '#050505',
                      fontWeight: '500'
                    }}>
                      Username
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#65676b'
                    }}>
                      @{user.username}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e4e6eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    📅
                  </div>
                  <div>
                    <div style={{
                      fontSize: '15px',
                      color: '#050505',
                      fontWeight: '500'
                    }}>
                      Joined
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#65676b'
                    }}>
                      {new Date(parseInt(user.createdAt)).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {user.bio && (
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e4e6eb'
                  }}>
                    <div style={{
                      fontSize: '15px',
                      color: '#050505',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      Bio
                    </div>
                    <div style={{
                      fontSize: '15px',
                      color: '#65676b',
                      lineHeight: '1.5'
                    }}>
                      {user.bio}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Posts */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 16px 0',
                color: '#050505'
              }}>
                Posts ({user.postCount})
              </h2>

              {user.posts && user.posts.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {user.posts.map((post) => (
                    <div
                      key={post._id}
                      style={{
                        border: '1px solid #e4e6eb',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        transition: 'box-shadow 0.2s'
                      }}
                    >
                      {/* Post Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                        gap: '8px'
                      }}>
                        <div style={{
                          fontSize: '13px',
                          color: '#65676b'
                        }}>
                          {new Date(parseInt(post.createdAt)).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Post Content */}
                      <h3 style={{
                        margin: '0 0 8px 0',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#050505'
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        margin: '0 0 12px 0',
                        fontSize: '14px',
                        color: '#65676b',
                        lineHeight: '1.5'
                      }}>
                        {post.content}
                      </p>

                      {/* Post Image */}
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          style={{
                            width: '100%',
                            maxHeight: '250px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        />
                      )}

                      {/* Post Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid #e4e6eb',
                        fontSize: '13px',
                        color: '#65676b'
                      }}>
                        <span>❤️ {post.likeCount} likes</span>
                        <span>💬 {post.commentCount} comments</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#65676b'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <div style={{ fontSize: '15px' }}>
                    No posts yet
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
