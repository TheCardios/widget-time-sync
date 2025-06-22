
interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (data: NotificationData): void => {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const notification = new Notification(data.title, {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    tag: data.tag,
    requireInteraction: true,
  });

  // Auto close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

export const scheduleNotification = (
  data: NotificationData, 
  scheduleTime: Date
): number => {
  const now = new Date().getTime();
  const delay = scheduleTime.getTime() - now;

  if (delay <= 0) {
    showNotification(data);
    return 0;
  }

  return window.setTimeout(() => {
    showNotification(data);
  }, delay);
};

export const checkUpcomingEvents = (): void => {
  // Mock event checking - in real implementation, this would check against Calendar API
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Example: notify at 9:00 AM for team meeting
  if (currentHour === 8 && currentMinute === 50) {
    showNotification({
      title: 'Upcoming Meeting',
      body: 'Team Meeting starts in 10 minutes',
      tag: 'meeting-reminder'
    });
  }

  // Example: notify at 2:20 PM for project review
  if (currentHour === 14 && currentMinute === 20) {
    showNotification({
      title: 'Upcoming Meeting',
      body: 'Project Review starts in 10 minutes', 
      tag: 'project-reminder'
    });
  }

  console.log('Checking for upcoming events...', now.toLocaleTimeString());
};
