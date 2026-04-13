import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getToken, isTokenValid } from './service/http';
import { AuthProvider } from './contexts/AuthContext';
import { NotificacoesProvider } from './contexts/NotificacoesContext';
import AppLayout from './components/AppLayout';

export default function ProtectedLayout() {
  const navigate = useNavigate();

  const token = getToken();
  const isAuthenticated = !!(token && token.trim().length > 0) && isTokenValid();

  // Garantia extra: navega programaticamente caso o <Navigate> não dispare
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthProvider>
      <NotificacoesProvider>
        <AppLayout />
      </NotificacoesProvider>
    </AuthProvider>
  );
}
