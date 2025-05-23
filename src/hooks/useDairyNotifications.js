
import { useState, useCallback } from 'react';

export const useDairyNotifications = () => {
  const [notifications, setNotifications] = useState({
    'cheese-factory': 3,
    'sales-accounts': 2,
    'dairy-coolers': 1,
    'cold-room': 0,
    'yogurt-processing': 1,
    'slaughterhouse': 2,
    'logistics': 0,
    'personnel': 4,
    'reports': 1
  });

  const addNotification = useCallback((sectionId, count = 1) => {
    setNotifications(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 0) + count
    }));
  }, []);

  const clearNotifications = useCallback((sectionId) => {
    setNotifications(prev => ({
      ...prev,
      [sectionId]: 0
    }));
  }, []);

  const markAsRead = useCallback((sectionId, count = 1) => {
    setNotifications(prev => ({
      ...prev,
      [sectionId]: Math.max(0, (prev[sectionId] || 0) - count)
    }));
  }, []);

  const getTotalNotifications = useCallback(() => {
    return Object.values(notifications).reduce((total, count) => total + count, 0);
  }, [notifications]);

  const getNotificationCount = useCallback((sectionId) => {
    return notifications[sectionId] || 0;
  }, [notifications]);

  return {
    notifications,
    addNotification,
    clearNotifications,
    markAsRead,
    getTotalNotifications,
    getNotificationCount
  };
};
