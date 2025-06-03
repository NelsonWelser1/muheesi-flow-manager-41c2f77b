
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { toast } = useToast();

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info',
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for immediate feedback
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });

    return newNotification.id;
  }, [toast]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Clear a specific notification
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Auto-add sample notifications for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: 'System Status',
        message: 'All dairy operations are running normally',
        type: 'success'
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
