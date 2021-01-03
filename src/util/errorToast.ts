import Toast from 'react-native-toast-message';

export default function errorToast(message?: string): void {
  console.error(new Error(message));
  Toast.show({
    type: 'error',
    text1: message || 'An unexpected error occurred',
  });
}

export function notificationToast(message: string): void {
  Toast.show({
    type: 'success',
    text1: message,
  });
}
