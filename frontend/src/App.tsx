import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainFeed } from './components/MainFeed';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoute>
          <MainFeed />
        </ProtectedRoute>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
