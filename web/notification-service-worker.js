/* eslint-env serviceworker */

console.info('[Service Worker] Registered');
function receivePushNotification(event) {
  console.info('[Service Worker] Push Received.');
  const { image, tag, url, title, text } = event.data.json();
  const options = {
    data: { url },
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge: '/favicon.ico',
  };
  event.waitUntil(self.registration.showNotification(title, options));
}
self.addEventListener('push', receivePushNotification);
