import React, { FunctionComponent, useContext, useState } from 'react';
import { Text } from '@ui-kitten/components';
import { View } from 'react-native';
import { parse } from 'url';
import { openAuthSessionAsync } from 'expo-web-browser';
import { makeUrl } from 'expo-linking';
import BigButton from '../common/BigButton';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import TextInput from '../common/TextInput';
import { useHistory } from '../router';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthActionType, AuthContext } from '../auth/authReducer';
import authFetch from '../util/authFetch';
import FullPageSpinner from '../common/FullPageSpinner';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('API_URL', API_URL);

const LoginSolid: FunctionComponent = () => {
  const history = useHistory();

  const [, authDispatch] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const initiateLogin = async (issuer: string) => {
    setLoading(true);
    const callbackUrl = makeUrl('onboard/callback');
    console.log('Opening Redirect');
    console.log(callbackUrl);
    const result = await openAuthSessionAsync(
      `${API_URL}/auth/login?redirect=${callbackUrl}&issuer=${issuer}`,
      callbackUrl,
    );
    console.log('AFTER REDIRECT', result.type);
    if (result.type === 'success') {
      const url = result.url;
      const parsedUrl = parse(url, true);
      const key = Array.isArray(parsedUrl.query.key)
        ? parsedUrl.query.key[0]
        : parsedUrl.query.key;
      if (key) {
        await AsyncStorage.setItem('authkey', key);
      }
      const response = await authFetch(`/profile/authenticated`, undefined, {
        expectedStatus: 200,
        errorHandlers: {
          '404': async () => {
            history.push('/onboard/person_index_request');
          },
        },
      });
      if (response.status === 200) {
        const profile = await response.json();
        authDispatch({ type: AuthActionType.LOGGED_IN, profile });
        history.push('/chat');
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <OnboardPageLayout
      title="Log In with an Existing Solid Account"
      middleContent={
        <>
          <View>
            <TextInput placeholder="WebId (https://example.com/profile/card#me)" />
            <BigButton
              title="Log In"
              onPress={() => history.push(`/onboard/push_notifications`)}
            />
          </View>
          <Text style={{ textAlign: 'center', marginVertical: 16 }}>OR</Text>
          <View>
            <BigButton
              title="Log In with solidcommunity.net"
              onPress={() => initiateLogin('https://solidcommunity.net')}
              containerStyle={{ marginBottom: 8 }}
            />
            <BigButton
              title="Log In with inrupt.net"
              onPress={() => initiateLogin('https://inrupt.net')}
              containerStyle={{ marginBottom: 8 }}
            />
            <BigButton
              title="Log In with ESS"
              onPress={() => initiateLogin('https://broker.pod.inrupt.com/')}
            />
          </View>
        </>
      }
    />
  );
};

export default LoginSolid;
