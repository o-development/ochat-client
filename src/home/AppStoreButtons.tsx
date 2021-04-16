import React, { FunctionComponent } from 'react';
import { Image, Linking, Platform, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PLAY_STORE_LINK =
  'https://play.google.com/store/apps/details?id=com.otherjackson.LiqidChat';
const APP_STORE_LINK = 'https://apps.apple.com/us/app/liqid-chat/id1558716710';

const AppStoreButtons: FunctionComponent = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
    <TouchableOpacity
      onPress={() => {
        Platform.OS !== 'web'
          ? Linking.openURL(APP_STORE_LINK)
          : window.open(APP_STORE_LINK, '_blank');
      }}
    >
      <Image
        source={require('../../assets/download-on-the-app-store.png')}
        style={{ width: 150, height: 44, margin: 10 }}
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        Platform.OS !== 'web'
          ? Linking.openURL(PLAY_STORE_LINK)
          : window.open(PLAY_STORE_LINK, '_blank');
      }}
    >
      <Image
        source={require('../../assets/google-play-badge.png')}
        style={{ width: 150, height: 44, margin: 10 }}
      />
    </TouchableOpacity>
  </View>
);

export default AppStoreButtons;
