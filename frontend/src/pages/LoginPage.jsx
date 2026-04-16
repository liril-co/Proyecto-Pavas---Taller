import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

function LoginPage() {
  usePageTitle('Iniciar Sesión');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@taller.com');
  const [password, setPassword] = useState('Admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/orders" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      const nextPath = location.state?.from?.pathname || '/orders';
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel auth-panel">
      <header className="panel-header">
        <h2>Iniciar sesion</h2>
      </header>

      <ErrorBanner message={error} />

      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </section>
  );
}

export default LoginPage;
