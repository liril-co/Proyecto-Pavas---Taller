import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);
let notificationId = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const pushNotification = ({ type = 'info', title, message, duration = 3200 }) => {
    const id = ++notificationId;
    const notification = { id, type, title, message };

    setNotifications((current) => [...current, notification]);

    window.setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  };

  const value = useMemo(
    () => ({
      notifications,
      pushNotification,
      removeNotification,
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
}
