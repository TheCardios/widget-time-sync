
import { useEffect } from 'react';
import { scheduleNotification, checkUpcomingEvents } from '@/utils/notify';

const NotificationManager = () => {
  useEffect(() => {
    // Check for upcoming events every minute
    const interval = setInterval(() => {
      checkUpcomingEvents();
    }, 60000); // 1 minute

    // Check immediately on mount
    checkUpcomingEvents();

    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything, it just manages notifications
  return null;
};

export default NotificationManager;
