import React, { FunctionComponent, useState } from 'react';
import { Text } from '@ui-kitten/components';
import BigButton from '../../common/BigButton';
import OnboardPageLayout from '../OnboardPageLayout';
import { useHistory } from '../../router';
import useAsyncEffect from 'use-async-effect';
import FullPageSpinner from '../../common/FullPageSpinner';

const PushNotifications: FunctionComponent = () => {
  const history = useHistory();
  const goToNext = () => {
    history.push('/chat');
  };
  const [areNotificationsOn] = useState(false);

  useAsyncEffect(async () => {
    // TODO check if push notifications are enabled
    goToNext();
  });

  const triggerPushNotifications = () => {
    // TODO trigger push notifications
  };

  if (!areNotificationsOn) {
    return <FullPageSpinner />;
  }

  return (
    <OnboardPageLayout
      title="Stay in the know"
      middleContent={
        <>
          <Text style={{ marginBottom: 16 }}>
            {`Enable push notifications to know when you recieve a message.`}
          </Text>
          <BigButton
            title="Enable Notifications"
            containerStyle={{ marginBottom: 8 }}
            onPress={() => triggerPushNotifications}
          />
          <BigButton
            appearance="ghost"
            title="Not right now"
            onPress={() => goToNext()}
          />
        </>
      }
    />
  );
};

export default PushNotifications;
