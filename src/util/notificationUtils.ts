import { Platform } from 'react-native';
import { PUSH_SERVER_PUBLIC_KEY } from '@env';
import errorToast from './errorToast';
import authFetch from './authFetch';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('PUSH_SERVER_PUBLIC_KEY', PUSH_SERVER_PUBLIC_KEY);

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
    console.log(
      await navigator.serviceWorker.register('/notification-service-worker.js'),
    );
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    const permissionResult = await Notification.requestPermission();
    if (permissionResult === 'denied') {
      errorToast(
        'Notifications are blocked. Remove the block in your browser settings and try again.',
      );
    }
    if (permissionResult !== 'granted') {
      return false;
    }
    //wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;
    // subscribe and return the subscription
    const pushSubscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: PUSH_SERVER_PUBLIC_KEY,
    });
    const result = await authFetch(
      '/notification/web-subscription',
      {
        method: 'post',
        body: JSON.stringify(pushSubscription),
        headers: {
          'content-type': 'application/json',
        },
      },
      { expectedStatus: 201 },
    );
    if (result.status === 201) {
      return true;
    }
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

export async function areNotificationsEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Notification.permission === 'granted';
  }
  return false;
}

export async function removeNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    errorToast('Notifications can be disabled in the browser settings.');
    return false;
  }
  return false;
}
