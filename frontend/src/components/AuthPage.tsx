import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { useAuth } from '../contexts/AuthContext';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();

  const handleLoginSuccess = (token: string, user: any) => {
    login(token, user);
  };

  const handleRegisterSuccess = (token: string, user: any) => {
    login(token, user);
  };

  if (isLogin) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setIsLogin(false)}
      />
    );
  }

  return (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  );
}