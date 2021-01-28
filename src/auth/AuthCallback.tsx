import React, { FunctionComponent, useState } from 'react';
import OnboardPageLayout from '../onboard/OnboardPageLayout';
import { View } from 'react-native';
import useAsyncEffect from 'use-async-effect';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { Text } from '@ui-kitten/components';

const CreateAccount: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState('');
  useAsyncEffect(async () => {
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
