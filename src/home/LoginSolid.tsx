import React, { FunctionComponent, useContext, useState } from 'react';
import { Text } from '@ui-kitten/components';
import { Platform, View } from 'react-native';
import { openAuthSessionAsync } from 'expo-web-browser';
import { makeUrl } from 'expo-linking';
import BigButton from '../common/BigButton';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import TextInput from '../common/TextInput';
import { API_URL } from '@env';
import { AuthContext } from '../auth/authReducer';
import FullPageSpinner from '../common/FullPageSpinner';
import { onSuccessfulAuthCallback } from '../auth/onSuccessfulAuthCallback';
import { useHistory } from '../router';
import * as ClientStorage from '../util/clientStorage';
import errorToast from '../util/errorToast';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('API_URL', API_URL);

interface LoginSolidProps {
  redirectAfterLogin: string;
}

const LoginSolid: FunctionComponent<LoginSolidProps> = ({
  redirectAfterLogin,
}) => {
  const [, authDispatch] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [issuer, setIssuer] = useState('');
  const history = useHistory();

  const initiateLogin = async (issuer: string) => {
    if (!issuer) {
      errorToast('You must enter a custom issuer.');
      return;
    }
    setLoading(true);
    const callbackUrl = makeUrl('auth-callback');
    const idpUrl = `${API_URL}/auth/login?redirect=${callbackUrl}&issuer=${issuer}`;

    // If the platform is web, open the idp in the same window. Safari is
    // overzealous about blocking popups, so we can't use "openAuthSessionAsync."
    if (Platform.OS === 'web') {
      await ClientStorage.setItem('redirectAfterLogin', redirectAfterLogin);
      window.location.assign(idpUrl);
      return;
    }

    const result = await openAuthSessionAsync(idpUrl, callbackUrl);
    if (result.type === 'success') {
      await onSuccessfulAuthCallback(result.url, authDispatch, () => {
        history.push(redirectAfterLogin);
      });
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
          </View>
          <Text style={{ textAlign: 'center', marginVertical: 16 }}>OR</Text>
          <View>
            <TextInput
              placeholder="Solid Issuer (https://solidcommunity.net/)"
              onChangeText={setIssuer}
            />
            <BigButton
              title="Log In with Custom Issuer"
              onPress={() => initiateLogin(issuer)}
            />
          </View>
        </>
      }
    />
  );
};

export default LoginSolid;
