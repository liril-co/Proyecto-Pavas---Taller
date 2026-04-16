import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import LoadingState from '../components/LoadingState';

import { listWorkOrders } from '../api/workshopApi';
import { useNotifications } from '../context/NotificationContext';
import { usePageTitle } from '../hooks/usePageTitle';

const ORDER_STATUSES = ['', 'RECIBIDA', 'DIAGNOSTICO', 'EN_PROCESO', 'LISTA', 'ENTREGADA', 'CANCELADA'];

function OrdersListPage() {
  usePageTitle('Órdenes de Trabajo');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [plate, setPlate] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0, pageSize: 10 });
  const { pushNotification } = useNotifications();

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listWorkOrders({ status, plate, page, pageSize: 10 });
      setRows(response.data || []);
      setPagination(response.pagination || { totalPages: 1, total: 0, pageSize: 10 });
    } catch (err) {
      setError(err.message || 'No se pudo cargar el listado');
      pushNotification({
        type: 'error',
        title: 'Error al cargar ordenes',
        message: err.message || 'No se pudo cargar el listado',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [status, plate, page]);

  return (
    <section className="panel">
      <h2>Órdenes de Trabajo</h2>
        <div className="filters">
        <label>
          Estado
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            {ORDER_STATUSES.map((option) => (
              <option key={option || 'all'} value={option}>{option || 'Todos'}</option>
            ))}
          </select>
        </label>
        <label>
          Placa
          <input
            value={plate}
            onChange={(e) => { setPage(1); setPlate(e.target.value.toUpperCase()); }}
            placeholder="Buscar por placa"
          />
        </label>
      </div>

      <ErrorBanner message={error} />
      {loading ? <LoadingState message="Cargando ordenes..." /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="6">No hay ordenes para los filtros actuales.</td></tr>
              ) : rows.map((order) => (
                <tr key={order.id}>
                  <td>{order.moto?.plate || '-'}</td>
                  <td>{order.moto?.client?.name || '-'}</td>
                  <td><span className={`status status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td>{new Date(order.entryDate).toLocaleDateString()}</td>
                  <td>${Number(order.total).toLocaleString('es-CO')}</td>
                  <td><Link to={`/orders/${order.id}`}>Detalle</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
        <span>Pagina {page} de {pagination.totalPages || 1}</span>
        <button disabled={page >= (pagination.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
        <Link className="btn" to="/orders/new">Crear orden</Link>
      </div>
    </section>
  );
}

export default OrdersListPage;
