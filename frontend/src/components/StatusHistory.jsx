import './StatusHistory.css';

function StatusHistory({ history = [] }) {
  if (history.length === 0) {
    return (
      <div className="status-history-empty">
        <p>No hay cambios de estado registrados aún</p>
      </div>
    );
  }

  const statusColors = {
    RECIBIDA: '#fbbf24',
    DIAGNOSTICO: '#f97316',
    EN_PROCESO: '#3b82f6',
    LISTA: '#8b5cf6',
    ENTREGADA: '#10b981',
    CANCELADA: '#ef4444',
  };

  return (
    <div className="status-history">
      <h3>Historial de cambios de estado</h3>
      <div className="timeline">
        {history.map((event, idx) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-marker">
              <div className="timeline-dot"></div>
              {idx < history.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-date">
                  {new Date(event.createdAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {' '}
                  {new Date(event.createdAt).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="timeline-user">{event.changedByUser?.name || 'Sistema'}</span>
              </div>
              <div className="timeline-transition">
                {event.fromStatus ? (
                  <>
                    <span className="status-badge" style={{ borderColor: statusColors[event.fromStatus] }}>
                      {event.fromStatus}
                    </span>
                    <span className="transition-arrow">→</span>
                  </>
                ) : (
                  <span className="initial">Orden creada</span>
                )}
                <span
                  className="status-badge current"
                  style={{ backgroundColor: statusColors[event.toStatus] + '20', borderColor: statusColors[event.toStatus] }}
                >
                  {event.toStatus}
                </span>
              </div>
              {event.note && (
                <div className="timeline-note">
                  <strong>Nota:</strong> {event.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusHistory;
