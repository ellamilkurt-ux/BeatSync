import React, { useEffect } from 'react';

function ToastCard({ id, message, type, removeNotification }) {
  // Auto dismiss timeout after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, removeNotification]);

  // Color selection based on notification type (error or destructive gets Crimson)
  const isDestructive = type === 'error' || type === 'destructive';
  const barColor = isDestructive ? 'bg-[#EF4444]' : 'bg-[#6366F1]';

  return (
    <div className="relative overflow-hidden bg-[#111118] text-[#FFFFFF] px-6 py-4 rounded-xl min-w-[280px] flex items-center justify-between animate-fade-in border border-zinc-800/60 shadow-[0_0_15px_rgba(99,102,241,0.08)]">
      {/* Tiny solid vertical bar on the immediate left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${barColor}`} />
      
      {/* Text message */}
      <span className="text-xs font-bold pl-2">{message}</span>

      {/* Dismiss Button */}
      <button 
        onClick={() => removeNotification(id)}
        className="text-[#8F9CAE] hover:text-[#FFFFFF] transition-colors ml-4 cursor-pointer flex-shrink-0"
        aria-label="Dismiss toast"
      >
        <svg viewBox="0 0 24 24" width="12" height="12" className="fill-current">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer({ notifications, removeNotification }) {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {notifications.map((notif) => (
          <ToastCard 
            key={notif.id} 
            id={notif.id}
            message={notif.message} 
            type={notif.type} 
            removeNotification={removeNotification}
          />
        ))}
      </div>
    </div>
  );
}
