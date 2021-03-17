import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Layout } from '@ui-kitten/components';
import {
  Image,
  Linking,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import LoginSolid from './LoginSolid';
import { AuthContext } from '../auth/authReducer';
import { useHistory } from '../router';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PLAY_STORE_LINK =
  'https://play.google.com/store/apps/details?id=com.otherjackson.LiqidChat';
const APP_STORE_LINK = 'https://liqid.chat';

const Home: FunctionComponent = () => {
  const isMobileDimensions = useWindowDimensions().width < 800;
  const isWeb = Platform.OS === 'web';

  const history = useHistory();
  const [authState] = useContext(AuthContext);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(true);
  useEffect(() => {
    if (authState.profile) {
      history.push('/chat');
    } else if (!authState.isLoading) {
      setIsWaitingForAuth(false);
    }
  }, [setIsWaitingForAuth, history, authState.isLoading, authState.profile]);
  if (isWaitingForAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../assets/splash.png')}
          style={{
            width: 205,
            height: 40,
          }}
        />
      </View>
    );
  }

  return (
    <Layout
      style={{
        flexDirection: isMobileDimensions ? 'column' : 'row',
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        width: '100%',
      }}
    >
      <View
        style={{
          flex: isMobileDimensions ? undefined : 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 25,
          paddingRight: 25,
        }}
      >
        <Image
          source={require('../../assets/splash.png')}
          style={{
            maxWidth: 564,
            width: '100%',
            height: 108,
            marginBottom: 25,
          }}
          resizeMode="contain"
        />
        {!isMobileDimensions && isWeb && (
          <View style={{ flexDirection: 'row' }}>
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
                console.log('herererere');
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
        )}
      </View>
      <LoginSolid redirectAfterLogin="/chat" />
    </Layout>
  );
};

export default Home;
