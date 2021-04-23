import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Layout, Text } from '@ui-kitten/components';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import LoginSolid from './LoginSolid';
import { AuthContext } from '../auth/authReducer';
import { useHistory } from '../router';
import AppStoreButtons from './AppStoreButtons';
import { ScrollView } from 'react-native-gesture-handler';
import Link from '../common/Link';

const Home: FunctionComponent = () => {
  const isMobileDimensions = useWindowDimensions().width < 800;
  const isTooShort = useWindowDimensions().height < 530;
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
    <Layout level="4" style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'position'}>
          <Layout
            style={{
              flexDirection: isMobileDimensions ? 'column' : 'row',
              flex: 1,
              alignItems: 'stretch',
              justifyContent: 'center',
              width: '100%',
              paddingVertical: 50,
            }}
          >
            <View
              style={{
                flex: isMobileDimensions ? undefined : 1,
                justifyContent: 'center',
                alignItems: isMobileDimensions ? 'center' : 'flex-end',
                paddingLeft: 25,
                paddingRight: 25,
                marginRight: 25,
              }}
            >
              {!isTooShort ? (
                <Image
                  source={require('../../assets/splash.png')}
                  style={{
                    maxWidth: 564,
                    width: '100%',
                    height: 100,
                    marginBottom: 25,
                  }}
                  resizeMode="contain"
                />
              ) : undefined}
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
            <View
              style={{
                flex: 1,
                alignItems: isMobileDimensions ? 'center' : 'flex-start',
              }}
            >
              <LoginSolid redirectAfterLogin="/chat" />
            </View>
          </Layout>
          <Layout level="4" style={{ padding: 25, flexDirection: 'row' }}>
            <Link href="https://o.team" content="Made by O" />
            <View style={{ width: 16 }} />
            <Link href="/privacy-policy" content="Privacy Policy" />
          </Layout>
        </KeyboardAvoidingView>
      </ScrollView>
    </Layout>
  );
};

export default Home;
