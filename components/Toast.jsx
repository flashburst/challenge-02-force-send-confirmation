import { useEffect, useCallback, useLayoutEffect, useState } from 'react';

// interface INotification {
//   id: number;
//   title: string;
//   message: string;
//   autoClose?: boolean;
//   timeout?: number;
// }

// INotification
const defaultNotification = {
  id: 0,
  title: 'Could not finalize transaction',
  message: '',
  autoClose: true,
  timeout: 5000, // ms
};

const generateUID = () => Math.floor(Math.random() * 999999);
export class Notify {
  static listeners = [];

  static on(callback) {
    Notify.listeners.push(callback);

    return {
      off: () => Notify.off(callback),
    };
  }

  static off(callback) {
    Notify.listeners = Notify.listeners.filter((cb) => cb !== callback);
  }

  // Partial<INotification>
  static emit(errorMessage) {
    const notificationMessage = Object.assign(
      {},
      defaultNotification,
      { id: generateUID() },
      errorMessage
    );
    Notify.listeners.forEach((callback) => callback(notificationMessage));
  }
}

export default function Toast() {
  const [notifications, setNotifications] = useState([]); // <INotification[]>

  /**
   * @param {number} id
   */
  const removeNotification = useCallback((id) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  }, []);

  useEffect(() => {
    const sub = Notify.on((notification) => {
      setNotifications((notifications) => [...notifications, notification]);
    });

    return () => sub.off();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
      }}
    >
      <ul
        style={{
          listStyleType: 'none',
        }}
      >
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            {...notification}
            removeNotification={removeNotification}
          />
        ))}
      </ul>
    </div>
  );
}

function NotificationItem({
  id,
  title,
  message,
  autoClose,
  timeout,
  removeNotification,
}) {
  // : INotification & {
  //   removeNotification: (id: INotification['id']) => void;
  // }
  useLayoutEffect(() => {
    if (autoClose) {
      const ref = setTimeout(() => {
        removeNotification(id);
      }, timeout);
      return () => {
        clearTimeout(ref);
      };
    }
  }, [id, autoClose, timeout, removeNotification]);
  return (
    <li
      style={{
        backgroundColor: 'rgb(210 210 210 / 55%)',
        color: '#000',
        padding: '15px 20px',
        borderRadius: '3px',
        backdropFilter: 'blur(4px)',
        marginBottom: '20px',
        marginRight: '10px',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>{title}</span>
      <p style={{ marginBottom: 0 }}>{message}</p>
    </li>
  );
}
