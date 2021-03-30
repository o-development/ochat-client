import React, { FunctionComponent, Fragment, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { initPushNotificationProcess } from './util/notificationUtils';

const NotificationInitializer: FunctionComponent = () => {
  // const [authState] = useContext(AuthContext);
  const [initialized, setInitialized] = useState(false);
  // const [initializedOnLogin, setInitializedOnLogin] = useState(false);
  useAsyncEffect(async () => {
    if (!initialized) {
      await initPushNotificationProcess();
      setInitialized(true);
    }
    // InitializeOnLogin was removed because it caused anyone who disabled notifications
    // to have them reactivated on reload.
    // if (!initializedOnLogin && authState.profile?.webId) {
    //   await initPushNotificationOnLogin();
    //   setInitializedOnLogin(true);
    // }
  });
  return <Fragment />;
};

export default NotificationInitializer;
