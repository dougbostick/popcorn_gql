export function Sidebar() {
  return (
    <div style={{
      width: '15%',
      minWidth: '200px',
      position: 'sticky',
      top: '70px',
      height: '60vh',
      padding: '20px 0'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        padding: '12px',
        height: '100%'
      }}>
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Navigation Button 1 */}
          <button
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#050505',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '20px' }}>🏠</span>
            <span>Home</span>
          </button>

          {/* Navigation Button 2 */}
          <button
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#050505',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '20px' }}>👥</span>
            <span>Friends</span>
          </button>

          {/* Navigation Button 3 */}
          <button
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#050505',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '20px' }}>⚙️</span>
            <span>Settings</span>
          </button>

          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#e4e6eb',
            margin: '8px 0'
          }}></div>

          {/* Additional Info Section */}
          <div style={{
            padding: '12px 16px',
            fontSize: '13px',
            color: '#65676b'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Quick Links</p>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              Explore more features coming soon!
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}
