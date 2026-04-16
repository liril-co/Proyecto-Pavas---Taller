import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import LoadingState from '../components/LoadingState';

import { createBike, createClient, createWorkOrder, listBikes } from '../api/workshopApi';
import { useNotifications } from '../context/NotificationContext';
import { usePageTitle } from '../hooks/usePageTitle';

function CreateOrderPage() {
  usePageTitle('Crear Orden de Trabajo');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const [bikeSearch, setBikeSearch] = useState('');
  const [bikeOptions, setBikeOptions] = useState([]);
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [faultDescription, setFaultDescription] = useState('');
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' });
  const [newBike, setNewBike] = useState({ plate: '', brand: '', model: '', cylinder: '' });
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const { pushNotification } = useNotifications();

  const searchBike = async () => {
    try {
      setError('');
      const response = await listBikes({ plate: bikeSearch, pageSize: 20 });
      const options = response.data || [];
      setBikeOptions(options);
      setShowQuickCreate(options.length === 0 && bikeSearch.trim().length > 0);
      pushNotification({
        type: options.length ? 'info' : 'warning',
        title: options.length ? 'Moto encontrada' : 'No hay coincidencias',
        message: options.length
          ? `Se encontraron ${options.length} motos con esa placa.`
          : 'Puedes registrar cliente y moto rapidamente.',
      });
    } catch (err) {
      setError(err.message);
      pushNotification({
        type: 'error',
        title: 'Error de busqueda',
        message: err.message,
      });
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorDetails([]);

    try {
      let bikeId = selectedBikeId;

      if (!bikeId && showQuickCreate) {
        try {
          const clientResponse = await createClient(newClient);
          const clientId = clientResponse.data.id;
          const bikeResponse = await createBike({ ...newBike, plate: newBike.plate.toUpperCase(), clientId });
          bikeId = bikeResponse.data.id;
        } catch (err) {
          setErrorDetails(err.details || []);
          throw new Error(err.message || 'No se pudo guardar cliente o moto');
        }
      }

      if (!bikeId) {
        throw new Error('Debes seleccionar una moto o registrarla rapidamente.');
      }

      const orderResponse = await createWorkOrder({ motoId: Number(bikeId), faultDescription });
      pushNotification({
        type: 'success',
        title: 'Orden creada',
        message: `La orden #${orderResponse.data.id} fue registrada correctamente.`,
      });
      navigate(`/orders/${orderResponse.data.id}`);
    } catch (err) {
      const errorMsg = err.message || 'No se pudo crear la orden';
      setError(errorMsg);
      pushNotification({
        type: 'error',
        title: 'No se pudo crear la orden',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Crear Orden de Trabajo</h2>
        <ErrorBanner message={error} details={errorDetails} />

      <form className="form-grid" onSubmit={handleCreateOrder}>
        <label>
          Buscar moto por placa
          <div className="inline-row">
            <input value={bikeSearch} onChange={(e) => setBikeSearch(e.target.value.toUpperCase())} placeholder="ABC123" />
            <button type="button" onClick={searchBike}>Buscar</button>
          </div>
        </label>

        {bikeOptions.length > 0 && (
          <label>
            Selecciona una moto existente
            <select value={selectedBikeId} onChange={(e) => setSelectedBikeId(e.target.value)}>
              <option value="">Seleccionar...</option>
              {bikeOptions.map((bike) => (
                <option key={bike.id} value={bike.id}>{bike.plate} - {bike.brand} {bike.model} - {bike.client?.name}</option>
              ))}
            </select>
          </label>
        )}

        {showQuickCreate && (
          <div className="quick-create">
            <h3>Registro rapido de cliente y moto</h3>
            <label>Nombre cliente<input value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} required /></label>
            <label>Telefono<input value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} required /></label>
            <label>Email<input value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} /></label>
            <label>Placa<input value={newBike.plate} onChange={(e) => setNewBike({ ...newBike, plate: e.target.value.toUpperCase() })} required /></label>
            <label>Marca<input value={newBike.brand} onChange={(e) => setNewBike({ ...newBike, brand: e.target.value })} required /></label>
            <label>Modelo<input value={newBike.model} onChange={(e) => setNewBike({ ...newBike, model: e.target.value })} required /></label>
            <label>Cilindraje (opcional)<input value={newBike.cylinder} onChange={(e) => setNewBike({ ...newBike, cylinder: e.target.value })} /></label>
          </div>
        )}

        <label>
          Descripcion de falla
          <textarea value={faultDescription} onChange={(e) => setFaultDescription(e.target.value)} required rows="4" />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear orden'}</button>
      </form>

      {loading && <LoadingState message="Guardando orden..." />}
    </section>
  );
}

export default CreateOrderPage;
