import React, { FunctionComponent, useContext, useState } from 'react';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import { Platform, View } from 'react-native';
import useAsyncEffect from 'use-async-effect';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { Text } from '@ui-kitten/components';
import { onSuccessfulAuthCallback } from './onSuccessfulAuthCallback';
import { AuthContext } from './authReducer';
import { useHistory } from '../router';
import * as ClientStorage from '../util/clientStorage';

const CreateAccount: FunctionComponent = () => {
  const [, authDispatch] = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  useAsyncEffect(async () => {
    if (Platform.OS === 'web') {
      // Get the redirect url.
      const redirectAfterLogin = await ClientStorage.getItem(
        'redirectAfterLogin',
      );
      if (!redirectAfterLogin) {
        setErrorMessage('Could not get the redirect page.');
        return;
      }
      await ClientStorage.deleteItem('redirectAfterLogin');
      onSuccessfulAuthCallback(window.location.href, authDispatch, () => {
        history.push(redirectAfterLogin);
      });
      return;
    }

    // For mobile
    const result = maybeCompleteAuthSession();
    if (result.type === 'failed') {
      setErrorMessage(result.message);
    }
  });
  return (
    <OnboardPageLayout
      title=""
      middleContent={
        <View>
          {errorMessage ? <Text>Error: {errorMessage}</Text> : undefined}
        </View>
      }
    />
  );
};

export default CreateAccount;
