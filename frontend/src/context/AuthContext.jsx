import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, loginRequest, refreshAccessToken, logoutRequest } from '../api/workshopApi';
import { useNotifications } from './NotificationContext';

const AuthContext = createContext(null);

// Decodificar JWT sin librería externa
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const { pushNotification } = useNotifications();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(accessToken));

  const logout = async (options = {}) => {
    // Intentar hacer logout en el servidor si hay refreshToken
    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch (_error) {
        // Ignorar errores en logout de servidor
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken('');
    setRefreshToken('');
    setUser(null);

    if (!options.silent) {
      pushNotification({
        type: 'info',
        title: 'Sesion cerrada',
        message: 'Has salido del sistema correctamente.',
      });
    }
  };

  const login = async (email, password) => {
    const response = await loginRequest({ email, password });
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;
    const authUser = response.data.user;

    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(authUser);
    pushNotification({
      type: 'success',
      title: 'Bienvenido',
      message: `Sesion iniciada como ${authUser.role}.`,
    });
    return authUser;
  };

  const refreshAccessTokenFn = async () => {
    if (!refreshToken) {
      await logout({ silent: true });
      return false;
    }

    try {
      const response = await refreshAccessToken(refreshToken);
      const newAccessToken = response.data.accessToken;
      const authUser = response.data.user;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('user', JSON.stringify(authUser));
      setAccessToken(newAccessToken);
      setUser(authUser);
      return true;
    } catch (_error) {
      await logout({ silent: true });
      pushNotification({
        type: 'warning',
        title: 'Sesion expirada',
        message: 'Tu sesion ya no es valida. Vuelve a iniciar sesion.',
      });
      return false;
    }
  };

  const refreshMe = async () => {
    if (!accessToken) return;
    try {
      const response = await getMe();
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
    } catch (_error) {
      await logout({ silent: true });
      pushNotification({
        type: 'warning',
        title: 'Sesion expirada',
        message: 'Tu sesion ya no es valida. Vuelve a iniciar sesion.',
      });
    }
  };

  // Verificar si el token está a punto de expirar (menos de 2 minutos)
  const isTokenExpiringSoon = () => {
    if (!accessToken) return false;
    const decoded = decodeJWT(accessToken);
    if (!decoded || !decoded.exp) return false;
    const expirationTime = decoded.exp * 1000; // Convertir a ms
    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;
    return timeUntilExpiry < 2 * 60 * 1000; // Menos de 2 minutos
  };

  // Intervalo para verificar si el token necesita refresh
  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(() => {
      if (isTokenExpiringSoon()) {
        refreshAccessTokenFn();
      }
    }, 1 * 60 * 1000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    refreshMe().finally(() => setLoading(false));
  }, [accessToken]);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      loading,
      isAuthenticated: Boolean(accessToken && user),
      login,
      logout,
      refreshMe,
      refreshAccessTokenFn,
    }),
    [accessToken, refreshToken, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
