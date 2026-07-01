import React, { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications, markAsRead, markAllRead } from '../services/notificationService';

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unread = notifications.filter((n) => !n.read).length;

  const load = async () => {
    if (!user) return;
    const data = await getUserNotifications(user.uid);
    setNotifications(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-slate-600 hover:text-green-600 rounded-lg" aria-label="Notifications">
        <FiBell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between p-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-800">Notifications</span>
            {unread > 0 && (
              <button onClick={() => { markAllRead(user.uid); load(); }} className="text-xs text-green-600 font-semibold">Mark all read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-slate-400 text-center">No notifications yet</p>
          ) : notifications.slice(0, 15).map((n) => (
            <button
              key={n.id}
              onClick={() => { if (!n.read) markAsRead(n.id).then(load); }}
              className={`w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 ${!n.read ? 'bg-green-50/50' : ''}`}
            >
              <p className="font-semibold text-xs text-slate-800">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
