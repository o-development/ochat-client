import React, { FunctionComponent, useState } from 'react';
import { Text } from '@ui-kitten/components';
import BigButton from '../../common/BigButton';
import OnboardPageLayout from '../OnboardPageLayout';
import { useHistory } from '../../router';
import useAsyncEffect from 'use-async-effect';
import FullPageSpinner from '../../common/FullPageSpinner';
import {
  areNotificationsEnabled,
  requestNotificationPermission,
} from '../../util/notificationUtils';

const PushNotifications: FunctionComponent = () => {
  const history = useHistory();
  const goToNext = () => {
    history.push('/chat');
  };
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    if (await areNotificationsEnabled()) {
      goToNext();
    } else {
      setLoading(false);
    }
  });

  const triggerPushNotifications = async () => {
    await requestNotificationPermission();
    goToNext();
  };

  if (loading) {
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
            onPress={triggerPushNotifications}
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
