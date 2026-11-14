import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types/notification';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { Report } from '../types/report';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  notifyAdminNewReport: (report: Report) => void;
  notifyUserIssueFixed: (report: Report) => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshNotifications = useCallback(() => {
    if (!currentUser || currentUser.role === 'Guest') {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    const userNotifs = notificationService.getNotificationsForUser(currentUser);
    const count = notificationService.getUnreadCount(currentUser);
    setNotifications(userNotifs);
    setUnreadCount(count);
  }, [currentUser]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = useCallback(
    (id: string) => {
      notificationService.markAsRead(id);
      refreshNotifications();
    },
    [refreshNotifications]
  );

  const markAllAsRead = useCallback(() => {
    if (!currentUser) return;
    notificationService.markAllAsRead(currentUser);
    refreshNotifications();
  }, [currentUser, refreshNotifications]);

  const notifyAdminNewReport = useCallback(
    (report: Report) => {
      notificationService.notifyAdminNewReport(report);
      refreshNotifications();
    },
    [refreshNotifications]
  );

  const notifyUserIssueFixed = useCallback(
    (report: Report) => {
      notificationService.notifyUserIssueFixed(report);
      refreshNotifications();
    },
    [refreshNotifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        notifyAdminNewReport,
        notifyUserIssueFixed,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
