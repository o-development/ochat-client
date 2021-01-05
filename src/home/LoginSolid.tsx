import React, { FunctionComponent } from 'react';
import { Text } from '@ui-kitten/components';
import { View } from 'react-native';
import { parse } from 'url';
import { openAuthSessionAsync } from 'expo-web-browser';
import { makeUrl } from 'expo-linking';
import BigButton from '../common/BigButton';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import TextInput from '../common/TextInput';
import { useHistory } from '../router';
import { API_URL, MOBILE_URL, WEB_URL } from '@env';
import AsyncStorage from '@react-native-community/async-storage';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('API_URL', API_URL);
console.info('MOBILE_URL', MOBILE_URL);
console.info('WEB_URL', WEB_URL);

const LoginSolid: FunctionComponent = () => {
  const history = useHistory();

  const initiateLogin = async (issuer: string) => {
    const callbackUrl = makeUrl('onboard/callback');
    console.log('Opening Redirect');
    console.log(callbackUrl);
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
        await AsyncStorage.setItem('authkey', key);
      }
      history.push('/onboard/person_index_request');
    }
  };

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
