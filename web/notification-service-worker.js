/* eslint-env serviceworker */

console.info('[Service Worker] Registered');
function receivePushNotification(event) {
  try {
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
  } catch (err) {
    console.info(err);
  }
}

function notificationClicked(event) {
  console.log('On notification click: ', event.notification.data);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        const navigateLocation = event.notification.data.url || '/';
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if ('focus' in client && 'navigate' in client) {
            client.navigate(navigateLocation);
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(navigateLocation);
      }),
  );
}

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', notificationClicked);
