import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import errorToast from './errorToast';
import { Platform } from 'react-native';

export async function initPushNotificationProcess(): Promise<void> {
  if (Platform.OS === 'web') {
    await navigator.serviceWorker.register('notification-service-worker.js');
  }
}

export async function registerForPushNotifications(): Promise<boolean> {
  try {
    console.log('Triggering Notifications');
    const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (!permission.granted) return false;
    const token = await Notifications.getExpoPushTokenAsync();
    return true;
  } catch (err) {
    errorToast(err.message || 'Could not register push notification.');
    console.log(err.message);
    return false;
  }
}
