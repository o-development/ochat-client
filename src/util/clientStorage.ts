import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  }
  throw new Error('Platform not supported.');
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    return localStorage.setItem(key, value);
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return SecureStore.setItemAsync(key, value);
  }
  throw new Error('Platform not supported.');
}

export async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    return localStorage.removeItem(key);
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return SecureStore.deleteItemAsync(key);
  }
  throw new Error('Platform not supported.');
}
