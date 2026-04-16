import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import LoadingState from '../components/LoadingState';

import StatusHistory from '../components/StatusHistory';
import { addWorkOrderItem, deleteWorkOrderItem, getWorkOrder, getWorkOrderHistory, updateWorkOrderStatus } from '../api/workshopApi';
import { useNotifications } from '../context/NotificationContext';
import { usePageTitle } from '../hooks/usePageTitle';

const FLOW = {
  RECIBIDA: ['DIAGNOSTICO', 'CANCELADA'],
  DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
  EN_PROCESO: ['LISTA', 'CANCELADA'],
  LISTA: ['ENTREGADA', 'CANCELADA'],
  ENTREGADA: [],
  CANCELADA: [],
};

function WorkOrderDetailPage() {
  usePageTitle('Detalle de Orden');
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [itemForm, setItemForm] = useState({ type: 'MANO_OBRA', description: '', count: 1, unitValue: 0 });
  const { pushNotification } = useNotifications();

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getWorkOrder(id);
      setOrder(response.data);
      
      // Cargar historial
      const historyResponse = await getWorkOrderHistory(id);
      setHistory(historyResponse.data || []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la orden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const nextStatuses = useMemo(() => FLOW[order?.status] || [], [order?.status]);

  const changeStatus = async (nextStatus) => {
    try {
      await updateWorkOrderStatus(order.id, nextStatus, statusNote);
      setStatusNote('');
      setShowNoteForm(false);
      await loadOrder();
      pushNotification({
        type: 'success',
        title: 'Estado actualizado',
        message: `La orden pasó a ${nextStatus}.`,
      });
    } catch (err) {
      setError(err.message || 'No fue posible cambiar estado');
      pushNotification({
        type: 'error',
        title: 'No se pudo cambiar el estado',
        message: err.message || 'No fue posible cambiar estado',
      });
    }
  };

  const submitItem = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await addWorkOrderItem(order.id, { ...itemForm, count: Number(itemForm.count), unitValue: Number(itemForm.unitValue) });
      setItemForm({ type: 'MANO_OBRA', description: '', count: 1, unitValue: 0 });
      await loadOrder();
      pushNotification({
        type: 'success',
        title: 'Item agregado',
        message: 'El item fue añadido correctamente a la orden.',
      });
    } catch (err) {
      setError(err.message || 'No se pudo agregar item');
      pushNotification({
        type: 'error',
        title: 'No se pudo agregar item',
        message: err.message || 'No se pudo agregar item',
      });
    }
  };

  const removeItem = async (itemId) => {
    try {
      await deleteWorkOrderItem(itemId);
      await loadOrder();
      pushNotification({
        type: 'info',
        title: 'Item eliminado',
        message: 'El item fue eliminado de la orden.',
      });
    } catch (err) {
      setError(err.message || 'No se pudo eliminar item');
      pushNotification({
        type: 'error',
        title: 'No se pudo eliminar item',
        message: err.message || 'No se pudo eliminar item',
      });
    }
  };

  if (loading) return <LoadingState message="Cargando detalle..." />;
  if (!order) return <ErrorBanner message="Orden no encontrada" />;

  return (
    <section className="panel">
      <h2>Orden #{order.id} - {order.status}</h2>
      <ErrorBanner message={error} />

      <div className="detail-grid">
        <article>
          <h3>Cliente</h3>
          <p>{order.moto?.client?.name}</p>
          <p>{order.moto?.client?.phone}</p>
          <p>{order.moto?.client?.email || 'Sin email'}</p>
        </article>
        <article>
          <h3>Moto</h3>
          <p>{order.moto?.plate}</p>
          <p>{order.moto?.brand} {order.moto?.model}</p>
          <p>Ingreso: {new Date(order.entryDate).toLocaleString()}</p>
        </article>
      </div>

      <article className="panel-card">
        <h3>Cambio de estado</h3>
        {nextStatuses.length === 0 ? (
          <p>Esta orden no admite más transiciones.</p>
        ) : (
          <>
            {showNoteForm && (
              <div className="form-grid" style={{ marginBottom: '16px' }}>
                <label>
                  Nota (opcional)
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Agregar una nota sobre el cambio de estado..."
                    rows="3"
                  />
                </label>
              </div>
            )}
            <div className="inline-row">
              {nextStatuses.map((status) => (
                <button key={status} type="button" onClick={() => {
                  if (!showNoteForm) {
                    setShowNoteForm(true);
                  } else {
                    changeStatus(status);
                  }
                }}>
                  {showNoteForm ? `Confirmar → ${status}` : status}
                </button>
              ))}
              {showNoteForm && (
                <button type="button" onClick={() => {
                  setShowNoteForm(false);
                  setStatusNote('');
                }} style={{ background: 'var(--muted)', color: 'white' }}>
                  Cancelar
                </button>
              )}
            </div>
          </>
        )}
      </article>

      <article className="panel-card">
        <StatusHistory history={history} />
      </article>

      <article className="panel-card">
        <h3>Items</h3>
        <form className="form-grid" onSubmit={submitItem}>
          <label>Tipo
            <select value={itemForm.type} onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}>
              <option value="MANO_OBRA">MANO_OBRA</option>
              <option value="REPUESTO">REPUESTO</option>
            </select>
          </label>
          <label>Descripcion<input value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} required /></label>
          <label>Cantidad<input type="number" min="1" value={itemForm.count} onChange={(e) => setItemForm({ ...itemForm, count: e.target.value })} required /></label>
          <label>Valor unitario<input type="number" min="0" step="0.01" value={itemForm.unitValue} onChange={(e) => setItemForm({ ...itemForm, unitValue: e.target.value })} required /></label>
          <button type="submit">Agregar item</button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Unitario</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).length === 0 ? (
                <tr><td colSpan="6">Sin items</td></tr>
              ) : (order.items || []).map((item) => {
                const subtotal = Number(item.count) * Number(item.unitValue);
                return (
                  <tr key={item.id}>
                    <td>{item.type}</td>
                    <td>{item.description}</td>
                    <td>{item.count}</td>
                    <td>${Number(item.unitValue).toLocaleString('es-CO')}</td>
                    <td>${subtotal.toLocaleString('es-CO')}</td>
                    <td><button type="button" onClick={() => removeItem(item.id)}>Eliminar</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="total">Total actual: ${Number(order.total).toLocaleString('es-CO')}</p>
      </article>
    </section>
  );
}

export default WorkOrderDetailPage;
