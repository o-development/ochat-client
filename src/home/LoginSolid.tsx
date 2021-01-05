import React, { FunctionComponent } from 'react';
import { Text } from '@ui-kitten/components';
import { Linking, Platform, View } from 'react-native';
import BigButton from '../common/BigButton';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import TextInput from '../common/TextInput';
import { useHistory } from '../router';
import { API_URL, MOBILE_URL, WEB_URL } from '@env';

const LoginSolid: FunctionComponent = () => {
  const history = useHistory();

  const initiateLogin = (issuer: string) => {
    const callbackUrl = Platform.OS === 'web' ? WEB_URL : MOBILE_URL;
    console.log('INITIATE LOGIN');
    console.log(API_URL);
    Linking.openURL(
      `${API_URL}/auth/login?redirect=${callbackUrl}/onboard/callback&issuer=${issuer}`,
    );
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
