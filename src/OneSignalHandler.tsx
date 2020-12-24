// import React, { Fragment, FunctionComponent, useEffect } from 'react';
// import { Platform } from 'react-native';
// import OneSignal from 'react-native-onesignal';
// import { ONE_SIGNAL_APP_ID } from './const.json';

// const OneSignalHandler: FunctionComponent = () => {
//   useEffect(() => {
//     if (Platform.OS !== 'web') {
//       const oneSignal = OneSignal;
//       // Platform.OS === 'web'
//       //   ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       //     // @ts-ignore
//       //     (window.OneSignal as typeof OneSignal)
//       //   : OneSignal;

//       //Remove this method to stop OneSignal Debugging
//       oneSignal.setLogLevel(6, 0);

//       // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
//       oneSignal.init(ONE_SIGNAL_APP_ID, {
//         kOSSettingsKeyAutoPrompt: false,
//         kOSSettingsKeyInAppLaunchURL: false,
//         kOSSettingsKeyInFocusDisplayOption: 2,
//       });
//       oneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

//       // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
//       // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

//       oneSignal.addEventListener('received', (notification) => {
//         console.log('Notification received: ', notification);
//       });
//       oneSignal.addEventListener('opened', (openResult) => {
//         console.log('Message: ', openResult.notification.payload.body);
//         console.log('Data: ', openResult.notification.payload.additionalData);
//         console.log('isActive: ', openResult.notification.isAppInFocus);
//         console.log('openResult: ', openResult);
//       });
//       oneSignal.addEventListener('ids', (device) => {
//         console.log('Device info: ', device);
//       });
//     }
//   });
//   return <Fragment />;
// };

// export default OneSignalHandler;
