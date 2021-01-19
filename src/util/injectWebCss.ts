import { Platform } from 'react-native';

export default function injectWebCss(): void {
  // Only on web
  if (Platform.OS !== 'web') return;

  // Inject style
  const style = document.createElement('style');
  style.textContent = `textarea, select, input, button { outline: none!important; }`;
  return document.head.append(style);
}
