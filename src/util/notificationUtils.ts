import { Platform } from 'react-native';

export function clientSupportsNotifications(): boolean {
  if (Platform.OS === 'web') {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
  return true;
}

export async function initPushNotificationProcess(): Promise<void> {
  if (!clientSupportsNotifications()) {
    return;
  }
  if (Platform.OS === 'web') {
    await navigator.serviceWorker.register('notification-service-worker.js');
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    const permissionResult = await Notification.requestPermission();
    return permissionResult === 'granted';
  }
  return false;

  // try {
  //   console.log('Triggering Notifications');
  //   const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   if (!permission.granted) return false;
  //   const token = await Notifications.getExpoPushTokenAsync();
  //   return true;
  // } catch (err) {
  //   errorToast(err.message || 'Could not register push notification.');
  //   console.log(err.message);
  //   return false;
  // }
}
