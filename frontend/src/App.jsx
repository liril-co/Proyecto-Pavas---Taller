import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import OrdersListPage from './pages/OrdersListPage';
import CreateOrderPage from './pages/CreateOrderPage';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ToastCenter from './components/ToastCenter';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/orders' && location.pathname.startsWith('/orders') && location.pathname !== '/orders/new') {
      return location.pathname === '/orders';
    }
    return location.pathname === path;
  };

  return (
    <div className="app-shell">
      <ToastCenter />
      <header className="topbar">
        <div>
          <h1>Taller Motos</h1>
          <p>Sistema de control de alistamientos y reparaciones</p>
        </div>
        {isAuthenticated && (
          <nav>
            <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>Ordenes</Link>
            <Link to="/orders/new" className={isActive('/orders/new') ? 'active' : ''}>Crear orden</Link>
            {user?.role === 'ADMIN' && <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link>}
            <span className="user-pill">{user?.name} ({user?.role})</span>
            <button type="button" onClick={logout}>Salir</button>
          </nav>
        )}
      </header>

      <main className="content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route
            path="/orders"
            element={<ProtectedRoute><OrdersListPage /></ProtectedRoute>}
          />
          <Route
            path="/orders/new"
            element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>}
          />
          <Route
            path="/orders/:id"
            element={<ProtectedRoute><WorkOrderDetailPage /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
