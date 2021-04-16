import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Divider, Text } from '@ui-kitten/components';
import { Image, Linking, Platform, View } from 'react-native';
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

interface IProviderData {
  name: string;
  issuer: string;
  registerLink: string;
}

const providerData: IProviderData[] = [
  {
    name: 'inrupt.net',
    issuer: 'https://inrupt.net',
    registerLink: 'https://inrupt.net/register',
  },
  {
    name: 'solidcommunity.net',
    issuer: 'https://solidcommunity.net',
    registerLink: 'https://solidcommunity.net/register',
  },
  {
    name: 'solidweb.org',
    issuer: 'https://solidweb.org',
    registerLink: 'https://solidweb.org/register',
  },
];

const LoginSolid: FunctionComponent<LoginSolidProps> = ({
  redirectAfterLogin,
}) => {
  const [, authDispatch] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [issuer, setIssuer] = useState('');
  const [nssModalIssuer, setNssModalIssuer] = useState<string | undefined>(
    undefined,
  );
  const history = useHistory();

  const performLogin = useCallback(
    async (issuer: string) => {
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
    },
    [authDispatch, history, redirectAfterLogin],
  );

  const initiateLogin = useCallback(
    async (issuer: string) => {
      if (!issuer) {
        errorToast('You must enter a custom issuer.');
        return;
      }
      setLoading(true);
      // Check if the issuer is NSS:
      const serverResponse = await fetch(issuer, { method: 'HEAD' });
      const powerByHeader = serverResponse.headers.get('X-Powered-By');
      const isNss = powerByHeader && powerByHeader.startsWith('solid-server/');
      // If it is NSS give instructions for trustedApp
      if (isNss) {
        setNssModalIssuer(issuer);
        return;
      }
      performLogin(issuer);
    },
    [performLogin],
  );

  if (nssModalIssuer) {
    return (
      <View
        style={{
          padding: 16,
          flex: 1,
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Text>
          When you see the screen below, be sure all permissions are checked.
          This will allow Liqid Chat to make new chats on your Pod and change
          their permissions to add your friends as participants.
        </Text>
        <Image
          source={require('../../assets/NSSAuthScreen.png')}
          style={{
            marginVertical: 16,
            width: '100%',
            height: 300,
            resizeMode: 'contain',
          }}
        />
        <BigButton
          title="Okay, continue to login"
          appearance="primary"
          onPress={() => {
            performLogin(nssModalIssuer);
            setNssModalIssuer(undefined);
          }}
        />
        <BigButton
          title="Back to issuer selection"
          appearance="ghost"
          onPress={() => {
            setNssModalIssuer(undefined);
            setLoading(false);
          }}
        />
      </View>
    );
  }

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <OnboardPageLayout
      title="Log In with a Solid Pod"
      middleContent={
        <>
          <View>
            {providerData.map((provider) => (
              <View key={provider.issuer}>
                <Text category="h5">Use {provider.name}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                  }}
                >
                  <BigButton
                    title="Get a Pod"
                    onPress={() => {
                      Platform.OS !== 'web'
                        ? Linking.openURL(provider.registerLink)
                        : window.open(provider.registerLink, '_blank');
                    }}
                    wrapperStyle={{ flex: 1, marginRight: 4 }}
                  />
                  <BigButton
                    title="Log In"
                    appearance="primary"
                    onPress={() => initiateLogin(provider.issuer)}
                    wrapperStyle={{ flex: 1, marginLeft: 4 }}
                  />
                </View>
                <Divider style={{ marginVertical: 16 }} />
              </View>
            ))}
          </View>
          <View>
            <TextInput
              placeholder="Solid Issuer (https://solidcommunity.net/)"
              onChangeText={setIssuer}
            />
            <BigButton
              title="Log In with Custom Issuer"
              appearance="primary"
              onPress={() => initiateLogin(issuer)}
            />
          </View>
        </>
      }
    />
  );
};

export default LoginSolid;
