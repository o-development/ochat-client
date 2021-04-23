import React, { FunctionComponent, Fragment } from 'react';
import useAsyncEffect from 'use-async-effect';
import { initPushNotificationProcess } from './util/notificationUtils';

const NotificationInitializer: FunctionComponent = () => {
  useAsyncEffect(async () => {
    await initPushNotificationProcess();
  }, []);

  return <Fragment />;
};

export default NotificationInitializer;
