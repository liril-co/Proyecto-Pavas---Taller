import { useEffect, useState } from 'react';
import ErrorBanner from '../components/ErrorBanner';
import LoadingState from '../components/LoadingState';
import { adminCreateUser, adminListUsers, adminUpdateUser } from '../api/workshopApi';
import { useNotifications } from '../context/NotificationContext';
import { usePageTitle } from '../hooks/usePageTitle';

function AdminPage() {
  usePageTitle('Administración de Usuarios');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const [passwordDrafts, setPasswordDrafts] = useState({});
  const { pushNotification } = useNotifications();
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MECANICO',
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminListUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const submitCreate = async (e) => {
    e.preventDefault();
    setError('');
    setErrorDetails([]);
    try {
      await adminCreateUser(createForm);
      setCreateForm({ name: '', email: '', password: '', role: 'MECANICO' });
      await loadUsers();
      pushNotification({
        type: 'success',
        title: 'Usuario creado',
        message: `${createForm.name} fue agregado al sistema.`,
      });
    } catch (err) {
      setErrorDetails(err.details || []);
      const errorMsg = err.message || 'No se pudo crear usuario';
      setError(errorMsg);
      pushNotification({
        type: 'error',
        title: 'No se pudo crear',
        message: errorMsg,
      });
    }
  };

  const changeRole = async (userId, role) => {
    setError('');
    try {
      await adminUpdateUser(userId, { role });
      await loadUsers();
      pushNotification({
        type: 'success',
        title: 'Rol actualizado',
        message: 'El rol del usuario fue modificado correctamente.',
      });
    } catch (err) {
      setError(err.message || 'No se pudo actualizar rol');
      pushNotification({
        type: 'error',
        title: 'No se pudo cambiar rol',
        message: err.message || 'No se pudo actualizar rol',
      });
    }
  };

  const changePassword = async (userId) => {
    const nextPassword = passwordDrafts[userId] || '';
    if (nextPassword.trim().length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    try {
      await adminUpdateUser(userId, { password: nextPassword });
      setPasswordDrafts((current) => ({ ...current, [userId]: '' }));
      await loadUsers();
      pushNotification({
        type: 'success',
        title: 'Contraseña actualizada',
        message: 'La nueva contraseña fue guardada correctamente.',
      });
    } catch (err) {
      setError(err.message || 'No se pudo cambiar la contraseña');
      pushNotification({
        type: 'error',
        title: 'Error al cambiar contraseña',
        message: err.message || 'No se pudo cambiar la contraseña',
      });
    }
  };

  const toggleActive = async (user) => {
    setError('');
    try {
      await adminUpdateUser(user.id, { isActive: !user.isActive });
      await loadUsers();
      pushNotification({
        type: 'success',
        title: 'Estado actualizado',
        message: `El usuario ahora se encuentra ${user.isActive ? 'desactivado' : 'activo'}.`,
      });
    } catch (err) {
      setError(err.message || 'No se pudo actualizar estado');
      pushNotification({
        type: 'error',
        title: 'No se pudo cambiar estado',
        message: err.message || 'No se pudo actualizar estado',
      });
    }
  };

  return (
    <section className="panel">
      <h2>Administración de Usuarios</h2>
      <ErrorBanner message={error} details={errorDetails} />

      <article className="panel-card">
        <h3>Crear usuario</h3>
        <form className="form-grid" onSubmit={submitCreate}>
          <label>Nombre<input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required /></label>
          <label>Contraseña<input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required minLength={6} /></label>
          <label>Rol
            <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
              <option value="MECANICO">MECANICO</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button type="submit">Crear usuario</button>
        </form>
      </article>

      <article className="panel-card">
        <h3>Usuarios</h3>
        {loading ? <LoadingState message="Cargando usuarios..." /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Nueva contraseña</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select value={user.role} onChange={(e) => changeRole(user.id, e.target.value)}>
                        <option value="MECANICO">MECANICO</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <div className="inline-row compact-row">
                        <input
                          type="password"
                          value={passwordDrafts[user.id] || ''}
                          onChange={(e) => setPasswordDrafts((current) => ({
                            ...current,
                            [user.id]: e.target.value,
                          }))}
                          placeholder="Nueva contraseña"
                        />
                        <button type="button" onClick={() => changePassword(user.id)}>
                          Cambiar
                        </button>
                      </div>
                    </td>
                    <td>{user.isActive ? 'SI' : 'NO'}</td>
                    <td>
                      <div className="inline-row compact-row">
                        <button type="button" onClick={() => toggleActive(user)}>
                          {user.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}

export default AdminPage;
