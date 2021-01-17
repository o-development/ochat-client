import React, { FunctionComponent } from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Routes } from './src/Routes';
import { View } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
// import OneSignalHandler from './src/OneSignalHandler';
import Toast from 'react-native-toast-message';
import injectWebCss from './src/util/injectWebCss';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// import { Notifications } from 'expo';

// Notifications.addListener((data: unknown) => {
//   /* do nothing */
//   console.log('Got Notification');
//   console.log(data);
// });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const OneSignal = (window as any).OneSignal;
// OneSignal.push(function () {
//   OneSignal.init({
//     appId: '5443b5c0-86a3-4df0-8ee1-a7d891336158',
//     notifyButton: {
//       enable: true,
//     },
//     allowLocalhostAsSecureOrigin: true,
//   });
//   OneSignal.showNativePrompt();
// });
injectWebCss();

const App: FunctionComponent = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* <OneSignalHandler /> */}
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingTop: getStatusBarHeight(),
          }}
        >
          <Routes />
        </View>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ApplicationProvider>
    </View>
  );
};

export default App;
