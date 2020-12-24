import React, { FunctionComponent, useContext, useState } from 'react';
import { Text } from '@ui-kitten/components';
import BigButton from '../../common/BigButton';
import OnboardPageLayout from '../OnboardPageLayout';
import authFetch from '../../util/authFetch';
import { useHistory } from '../../router';
import useAsyncEffect from 'use-async-effect';
import FullPageSpinner from '../../common/FullPageSpinner';
import IProfile, { AuthActionType, AuthContext } from '../../auth/authReducer';

const PersonIndexRequest: FunctionComponent = () => {
  const history = useHistory();
  const [, authDispatch] = useContext(AuthContext);
  const goToNext = async (profile: IProfile) => {
    authDispatch({ type: AuthActionType.LOGGED_IN, profile });
    history.push('/onboard/push_notifications');
  };
  const [isNotIndexed, setIsNotIndexed] = useState(false);

  useAsyncEffect(async () => {
    const response = await authFetch(`/profile/authenticated`, undefined, {
      expectedStatus: 200,
      errorHandlers: {
        '404': async () => {
          /* Do nothing */
        },
      },
    });
    if (response.status === 200) {
      goToNext(await response.json());
    }
    setIsNotIndexed(true);
  });

  const addToPersonIndex = async (shouldBeSearchable?: boolean) => {
    const response = await authFetch(
      `/profile/authenticated?searchable=${shouldBeSearchable}`,
      {
        method: 'post',
      },
      {
        expectedStatus: 201,
      },
    );
    if (response.status === 201) {
      goToNext(await response.json());
    }
  };

  if (!isNotIndexed) {
    return <FullPageSpinner />;
  }

  return (
    <OnboardPageLayout
      title="Help your friends find you"
      middleContent={
        <>
          <Text style={{ marginBottom: 16 }}>
            {`Make yourself searchable on the "Person Index" to make it easier for your friends to find you by name. If you're not searchable, your friends will need to manually enter your WebId.`}
          </Text>
          <BigButton
            title="Make me Searchable"
            containerStyle={{ marginBottom: 8 }}
            onPress={() => addToPersonIndex(true)}
          />
          <BigButton
            appearance="ghost"
            title="Not right now"
            onPress={() => addToPersonIndex(false)}
          />
        </>
      }
    />
  );
};

export default PersonIndexRequest;
