import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PUSH_SERVER_PUBLIC_KEY } from '@env';
import errorToast from './errorToast';
import authFetch from './authFetch';
import * as ClientStorage from '../util/clientStorage';
import { v4 } from 'uuid';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('PUSH_SERVER_PUBLIC_KEY', PUSH_SERVER_PUBLIC_KEY);

/**
 * Types for notification subscriptions
 */
export type INotificationSubscription =
  | IWebNotificationSubscription
  | IMobileNotificationSubscription;

export interface IBaseNotificationSubscription {
  type: string;
  subscription: unknown;
}

export interface IWebNotificationSubscription
  extends IBaseNotificationSubscription {
  type: 'web';
  subscription: IWebSubscription;
}

export interface IWebSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

export interface IMobileNotificationSubscription
  extends IBaseNotificationSubscription {
  type: 'mobile';
  subscription: string;
}

/**
 * Checks if the browser supports push notifications
 */
export async function doesClientSupportPushNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return true;
  } else {
    return false;
  }
}

/**
 * Initializes the environment for push notifications when the application mounts
 */
export async function initPushNotificationProcess(): Promise<void> {
  if (!(await doesClientSupportPushNotifications())) {
    return;
  }
  let clientId = await ClientStorage.getItem('clientId');
  if (!clientId) {
    clientId = v4();
    await ClientStorage.setItem('clientId', clientId);
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
  }
}

/**
 * Initializes push notification information when application logged in
 */
export async function initPushNotificationOnLogin(): Promise<void> {
  if (!(await doesClientSupportPushNotifications())) {
    return;
  }
  const [isGranted, isSubscribed] = await Promise.all([
    isNotificationAccessGranted(),
    isSubscriptionRegistered(),
  ]);
  if (isGranted && !isSubscribed) {
    await registerNotificationSubscription();
  }
}

/**
 * Requests access permissions to send push notifications
 * @returns true if the permission is granted
 */
export async function requestNotificationAccess(): Promise<boolean> {
  if (!(await doesClientSupportPushNotifications())) {
    return false;
  }
  let notificationPermission: string;
  if (Platform.OS === 'web') {
    notificationPermission = await Notification.requestPermission();
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const { status } = await Notifications.requestPermissionsAsync();
    notificationPermission = status;
  } else {
    return false;
  }
  if (notificationPermission === 'denied') {
    errorToast(
      'Notifications are blocked. Remove the block in your settings and try again.',
    );
  }
  return notificationPermission === 'granted';
}

/**
 * Registers a push notification with the server
 */
export async function registerNotificationSubscription(): Promise<boolean> {
  let notificationSubscription: INotificationSubscription;
  if (Platform.OS === 'web') {
    //wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;
    // subscribe and return the subscription
    notificationSubscription = {
      type: 'web',
      subscription: await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PUSH_SERVER_PUBLIC_KEY,
      }),
    };
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [200, 100, 200],
        lightColor: '#FF231F7C',
      });
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    notificationSubscription = {
      type: 'mobile',
      subscription: token,
    };
  } else {
    return false;
  }
  const clientId = await ClientStorage.getItem('clientId');
  if (!clientId) {
    return false;
  }
  const result = await authFetch(
    `/notification/subscription/${clientId}`,
    {
      method: 'post',
      body: JSON.stringify(notificationSubscription),
      headers: {
        'content-type': 'application/json',
      },
    },
    { expectedStatus: 201 },
  );
  if (result.status === 201 || result.status === 409) {
    return true;
  }
  return false;
}

/**
 * Does all required activities to enable notifications
 * @returns true if notifications were enabled
 */
export async function enableNotifications(): Promise<boolean> {
  if (!(await doesClientSupportPushNotifications())) {
    return false;
  }
  if (!(await isNotificationAccessGranted())) {
    const wasRequestSuccessful = await requestNotificationAccess();
    if (!wasRequestSuccessful) {
      return false;
    }
  }
  if (!(await isSubscriptionRegistered())) {
    const wasRegistrationSuccessful = await registerNotificationSubscription();
    if (!wasRegistrationSuccessful) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if permissions are granted to send push notifications
 * @returns true if access is granted
 */
export async function isNotificationAccessGranted(): Promise<boolean> {
  if (!(await doesClientSupportPushNotifications())) {
    return false;
  }
  if (Platform.OS === 'web') {
    return Notification.permission === 'granted';
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (await Notifications.getPermissionsAsync()).status === 'granted';
  }
  return false;
}

/**
 * Checks with the push server on the API if this client is registered
 * @returns true if the subscription is registered
 */
export async function isSubscriptionRegistered(): Promise<boolean> {
  const clientId = await ClientStorage.getItem('clientId');
  if (!clientId) {
    return false;
  }
  const result = await authFetch(
    `/notification/subscription/${clientId}`,
    {
      method: 'get',
    },
    {
      expectedStatus: 200,
      errorHandlers: {
        '404': async () => {
          /* Do Nothing */
        },
      },
    },
  );
  if (result.status === 200) {
    return true;
  }
  return false;
}

/**
 * @returns true if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const [isGranted, isSubscribed] = await Promise.all([
    isNotificationAccessGranted(),
    isSubscriptionRegistered(),
  ]);
  return isGranted && isSubscribed;
}

/**
 * Stops notifications from being sent. This does not remove the permissions,
 * it just removes the client from the server.
 * @returns true if notifications were successfully disabled
 */
export async function disableNotifications(): Promise<boolean> {
  const clientId = await ClientStorage.getItem('clientId');
  if (!clientId) {
    return false;
  }
  const result = await authFetch(
    `/notification/subscription/${clientId}`,
    {
      method: 'delete',
    },
    {
      expectedStatus: 200,
    },
  );
  if (result.status === 200) {
    return true;
  }
  return false;
}
