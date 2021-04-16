import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { Image, Platform, useWindowDimensions, View } from 'react-native';
import LoginSolid from './LoginSolid';
import { AuthContext } from '../auth/authReducer';
import { useHistory } from '../router';
import AppStoreButtons from './AppStoreButtons';

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
          <View
            style={{
              alignItems: 'center',
              maxWidth: 564,
              width: '100%',
            }}
          >
            <Text category="h1" style={{ textAlign: 'center' }}>
              Store your messages on your Solid Pod, not with a Company
            </Text>
            <Image
              source={require('../../assets/productPicture.png')}
              style={{
                width: '100%',
                height: 400,
                marginVertical: 16,
                resizeMode: 'contain',
              }}
            />
            <AppStoreButtons />
          </View>
        )}
      </View>
      <LoginSolid redirectAfterLogin="/chat" />
    </Layout>
  );
};

export default Home;
