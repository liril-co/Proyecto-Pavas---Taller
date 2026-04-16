import { useNotifications } from '../context/NotificationContext';

function ToastCenter() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="toast-center" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <article key={notification.id} className={`toast toast-${notification.type}`}>
          <div className="toast-copy">
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>
          <button type="button" className="toast-close" onClick={() => removeNotification(notification.id)}>
            ×
          </button>
        </article>
      ))}
    </div>
  );
}

export default ToastCenter;
