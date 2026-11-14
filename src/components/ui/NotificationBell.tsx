import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Check,
  Flame,
  ExternalLink
} from 'lucide-react';
import { formatDateTime, formatRelativeTime } from '../../utils/date';

interface NotificationBellProps {
  colorTheme?: 'dark' | 'light';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  colorTheme = 'light'
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (id: string, link: string) => {
    markAsRead(id);
    setIsOpen(false);
    navigate(link);
  };

  const isDark = colorTheme === 'dark';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition ${
          isDark
            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title={`Notifications (${unreadCount} unread)`}
        aria-label="Open notifications menu"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">No notifications yet</div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Updates on new reported issues and fixed repairs will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isAdminNewReport = notif.type === 'NEW_REPORT';
                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleNotificationClick(notif.id, notif.link)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 group hover:bg-slate-50 ${
                      !notif.read ? 'bg-blue-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Icon Badge */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${
                        isAdminNewReport
                          ? notif.riskLevel === 'High'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-purple-100 text-purple-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {isAdminNewReport ? (
                        notif.riskLevel === 'High' ? (
                          <Flame className="w-4 h-4 fill-current" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>

                    {/* Notification Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition truncate">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span
                            className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"
                            title="Unread"
                          />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{notif.location}</span>
                        </span>

                        <span className="flex items-center gap-1 font-mono flex-shrink-0">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatRelativeTime(notif.timestamp)}</span>
                        </span>
                      </div>

                      {/* Metadata Chips */}
                      {isAdminNewReport && notif.riskLevel && (
                        <div className="pt-1 flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              notif.riskLevel === 'High'
                                ? 'bg-red-100 text-red-700'
                                : notif.riskLevel === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {notif.riskLevel} Risk ({notif.riskScore || 'Calculated'})
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            ID: {notif.reportId}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
