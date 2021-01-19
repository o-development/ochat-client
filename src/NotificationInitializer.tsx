import React, {
  FunctionComponent,
  Fragment,
  useContext,
  useState,
} from 'react';
import useAsyncEffect from 'use-async-effect';
import { AuthContext } from './auth/authReducer';
import {
  initPushNotificationOnLogin,
  initPushNotificationProcess,
} from './util/notificationUtils';

const NotificationInitializer: FunctionComponent = () => {
  const [authState] = useContext(AuthContext);
  const [initialized, setInitialized] = useState(false);
  const [initializedOnLogin, setInitializedOnLogin] = useState(false);
  useAsyncEffect(async () => {
    if (!initialized) {
      await initPushNotificationProcess();
      setInitialized(true);
    }
    if (!initializedOnLogin && authState.profile?.webId) {
      await initPushNotificationOnLogin();
      setInitializedOnLogin(true);
    }
  });
  return <Fragment />;
};

export default NotificationInitializer;
