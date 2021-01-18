import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PUSH_SERVER_PUBLIC_KEY } from '@env';
import errorToast from './errorToast';
import authFetch from './authFetch';
import AsyncStorage from '@react-native-community/async-storage';
import { History } from 'history';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('PUSH_SERVER_PUBLIC_KEY', PUSH_SERVER_PUBLIC_KEY);

export function clientSupportsNotifications(): boolean {
  if (Platform.OS === 'web') {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
  return true;
}

export async function initPushNotificationProcess(options?: {
  history?: History;
}): Promise<void> {
  if (!clientSupportsNotifications()) {
    return;
  }
  if (Platform.OS === 'web') {
    await navigator.serviceWorker.register('/notification-service-worker.js');
  } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const grantedPermissions =
      (await Notifications.getPermissionsAsync()).status === 'granted';
    const tokenGenerated =
      (await AsyncStorage.getItem('tokenGenerated')) === 'true';
    if (grantedPermissions && !tokenGenerated) {
      await setupExpoToken();
    }
  }
}

async function setupExpoToken(): Promise<void> {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [200, 100, 200],
      lightColor: '#FF231F7C',
    });
  }
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const result = await authFetch(
    '/notification/mobile-subscription',
    {
      method: 'post',
      body: JSON.stringify({ token }),
      headers: {
        'content-type': 'application/json',
      },
    },
    { expectedStatus: 201 },
  );
  if (result.status === 201) {
    await AsyncStorage.setItem('tokenGenerated', 'true');
  } else {
    throw new Error('Problem setting up mobile push token.');
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
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'denied') {
      errorToast(
        'Notifications are blocked. Remove the block in your browser settings and try again.',
      );
    }
    if (status !== 'granted') {
      return false;
    }
    try {
      await setupExpoToken();
    } catch {
      return false;
    }
  }
  return false;
}

export async function areNotificationsEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Notification.permission === 'granted';
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const notificationStatus = (await Notifications.getPermissionsAsync())
      .status;
    const generatedToken = await AsyncStorage.getItem('tokenGenerated');
    return notificationStatus === 'granted' && generatedToken === 'true';
  }
  return false;
}

export async function removeNotificationPermission(): Promise<boolean> {
  // TODO: this function sucks. It should just disable all notifications on the server.
  if (Platform.OS === 'web') {
    errorToast('Notifications can be disabled in the browser settings.');
    return false;
  } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
    errorToast('Notifications can be disabled in the phone settings.');
    AsyncStorage.removeItem('tokenGenerated');
    return true;
  }
  return false;
}
