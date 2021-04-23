import React, { FunctionComponent, Fragment } from 'react';
import useAsyncEffect from 'use-async-effect';
import { initPushNotificationProcess } from './util/notificationUtils';
import { addNotificationResponseReceivedListener } from 'expo-notifications';
import { useHistory } from 'react-router';

const NotificationInitializer: FunctionComponent = () => {
  const history = useHistory();
  useAsyncEffect(async () => {
    await initPushNotificationProcess();
    const subscription = addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data.url as string;
      history.push(url);
    });
    return () => subscription.remove();
  }, []);

  return <Fragment />;
};

export default NotificationInitializer;
