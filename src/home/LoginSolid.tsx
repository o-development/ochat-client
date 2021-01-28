import React, { FunctionComponent, useContext, useState } from 'react';
import { Text } from '@ui-kitten/components';
import { View } from 'react-native';
import { parse } from 'url';
import { openAuthSessionAsync } from 'expo-web-browser';
import { makeUrl } from 'expo-linking';
import BigButton from '../common/BigButton';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import TextInput from '../common/TextInput';
import { API_URL } from '@env';
import * as ClientStorage from '../util/clientStorage';
import { AuthActionType, AuthContext } from '../auth/authReducer';
import authFetch from '../util/authFetch';
import FullPageSpinner from '../common/FullPageSpinner';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('API_URL', API_URL);

interface LoginSolidProps {
  onLogin?: () => void;
}

const LoginSolid: FunctionComponent<LoginSolidProps> = ({ onLogin }) => {
  const [, authDispatch] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [issuer, setIssuer] = useState('');

  const initiateLogin = async (issuer: string) => {
    setLoading(true);
    const callbackUrl = makeUrl('auth-callback');
    const result = await openAuthSessionAsync(
      `${API_URL}/auth/login?redirect=${callbackUrl}&issuer=${issuer}`,
      callbackUrl,
    );
    if (result.type === 'success') {
      const url = result.url;
      const parsedUrl = parse(url, true);
      const key = Array.isArray(parsedUrl.query.key)
        ? parsedUrl.query.key[0]
        : parsedUrl.query.key;
      if (key) {
        await ClientStorage.setItem('authkey', key);
      }
      const response = await authFetch(`/profile/authenticated`, undefined, {
        expectedStatus: 200,
        errorHandlers: {
          '404': async () => {
            authDispatch({
              type: AuthActionType.REQUIRES_ONBOARDING,
              profileRequiresOnboarding: true,
            });
            if (onLogin) {
              onLogin();
            }
          },
        },
      });
      if (response.status === 200) {
        const profile = await response.json();
        authDispatch({ type: AuthActionType.LOGGED_IN, profile });
        if (onLogin) {
          onLogin();
        }
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
          <Text style={{ textAlign: 'center', marginVertical: 16 }}>OR</Text>
          <View>
            <TextInput
              placeholder="Solid Issuer (https://solidcommunity.net/)"
              onChangeText={setIssuer}
            />
            <BigButton title="Log In" onPress={() => initiateLogin(issuer)} />
          </View>
        </>
      }
    />
  );
};

export default LoginSolid;
