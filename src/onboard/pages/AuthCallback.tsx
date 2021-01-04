import React, { FunctionComponent, useState } from 'react';
import OnboardPageLayout from '../OnboardPageLayout';
import { View } from 'react-native';
import useAsyncEffect from 'use-async-effect';
import { parse } from 'url';
import { Text } from '@ui-kitten/components';
import AsyncStorage from '@react-native-community/async-storage';
import { useHistory, useLocation } from '../../router';

const CreateAccount: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const location = useLocation();
  useAsyncEffect(async () => {
    try {
      // Handle login callback
      const url = `${location.pathname}${location.search}`;
      if (!url) {
        throw new Error('Could not get inital URL');
      }
      const parsedUrl = parse(url, true);
      const key = Array.isArray(parsedUrl.query.key)
        ? parsedUrl.query.key[0]
        : parsedUrl.query.key;
      if (key) {
        await AsyncStorage.setItem('authkey', key);
      }
      history.push('/onboard/person_index_request');
    } catch (err) {
      setErrorMessage(err.message);
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
