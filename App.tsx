import React, { FunctionComponent } from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { Routes } from './src/Routes';
import { View } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Toast from 'react-native-toast-message';
import injectWebCss from './src/util/injectWebCss';
import { getStatusBarHeight } from 'react-native-status-bar-height';

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
      <ApplicationProvider
        {...eva}
        theme={{
          ...eva.light,
          'color-primary-default': eva.light['color-primary-400'],
        }}
      >
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
