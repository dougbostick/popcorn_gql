import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <h1 style={{
            margin: 0,
            color: '#4267B2',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Popcorn
          </h1>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '500',
                backgroundColor: isActive('/') ? '#e7f3ff' : 'transparent',
                color: isActive('/') ? '#4267B2' : '#65676b',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.backgroundColor = '#f2f3f5';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              🏠 Home
            </Link>
            <Link
              to="/friends"
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '500',
                backgroundColor: isActive('/friends') ? '#e7f3ff' : 'transparent',
                color: isActive('/friends') ? '#4267B2' : '#65676b',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isActive('/friends')) {
                  e.currentTarget.style.backgroundColor = '#f2f3f5';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive('/friends')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              👥 Friends
            </Link>
            <Link
              to="/profile"
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '500',
                backgroundColor: isActive('/profile') ? '#e7f3ff' : 'transparent',
                color: isActive('/profile') ? '#4267B2' : '#65676b',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isActive('/profile')) {
                  e.currentTarget.style.backgroundColor = '#f2f3f5';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive('/profile')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              👤 Profile
            </Link>
          </div>

          {/* User Info & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#4267B2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {user?.displayName[0] || '?'}
              </div>
              <span style={{
                fontWeight: '600',
                color: '#050505',
                fontSize: '15px'
              }}>
                {user?.displayName}
              </span>
            </div>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid #ccc',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#65676b',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f2f3f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Page Content with Sidebar */}
      <div style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        gap: '20px'
      }}>
        {/* Left Sidebar - Show on home and friends pages */}
        {(location.pathname === '/' || location.pathname === '/friends') && <Sidebar />}

        {/* Main Content */}
        <div style={{
          flex: 1,
          minWidth: 0
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
