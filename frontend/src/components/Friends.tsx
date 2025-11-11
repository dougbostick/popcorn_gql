import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../generated/graphql';
import { useAuth } from '../contexts/AuthContext';

export function Friends() {
  const { loading, error, data } = useGetUsersQuery();
  const { user: currentUser } = useAuth();

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
          <div style={{ color: '#666' }}>Loading friends...</div>
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
        Error loading friends: {error.message}
      </div>
    );
  }

  // Filter out the current user from the list
  const friends = data?.users?.filter(user => user._id !== currentUser?._id) || [];

  return (
    <div style={{
      maxWidth: '600px',
      margin: '20px auto',
      padding: '0 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#050505',
        marginBottom: '20px'
      }}>
        Friends
      </h1>

      {friends.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          color: '#65676b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <div style={{ fontSize: '16px' }}>No friends yet</div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={`/user/${friend._id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e4e6eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#4267B2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {friend.avatar ? (
                    <img
                      src={friend.avatar}
                      alt={friend.displayName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    friend.displayName[0].toUpperCase()
                  )}
                </div>

                {/* User Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#050505',
                    marginBottom: '4px'
                  }}>
                    {friend.displayName}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#65676b'
                  }}>
                    @{friend.username}
                  </div>
                  {friend.bio && (
                    <div style={{
                      fontSize: '13px',
                      color: '#65676b',
                      marginTop: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {friend.bio}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '13px',
                  color: '#65676b'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontWeight: 'bold',
                      color: '#050505',
                      fontSize: '16px'
                    }}>
                      {friend.postCount}
                    </div>
                    <div>Posts</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontWeight: 'bold',
                      color: '#050505',
                      fontSize: '16px'
                    }}>
                      {friend.followerCount}
                    </div>
                    <div>Followers</div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div style={{
                  fontSize: '20px',
                  color: '#65676b'
                }}>
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
