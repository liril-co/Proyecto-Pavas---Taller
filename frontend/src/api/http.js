import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

http.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error?.response?.data || {};
    const apiError = errorData.message || errorData.error || error.message;
    const err = new Error(apiError);
    err.details = errorData.details || [];
    err.response = error?.response;

    // Si es 401 (no autenticado), intentar refresh del token
    if (error?.response?.status === 401 && !isRefreshing) {
      const refreshToken = localStorage.getItem('refreshToken');

      // Si no hay refreshToken, hacer logout
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(err);
      }

      isRefreshing = true;

      // Hacer llamada a refresh
      return http
        .post('/auth/refresh', { refreshToken })
        .then((response) => {
          const newAccessToken = response.data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));

          // Actualizar header y reintentar request original
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return http(error.config);
        })
        .catch((refreshError) => {
          // Si refresh falla, hacer logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          processQueue(refreshError, null);
          window.location.href = '/';
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    // Si ya estamos refrescando, agregar a la cola
    if (error?.response?.status === 401 && isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          error.config.headers.Authorization = `Bearer ${token}`;
          return http(error.config);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    return Promise.reject(err);
  }
);

export default http;
