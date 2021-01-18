import React, {
  FunctionComponent,
  Fragment,
  useContext,
  useState,
} from 'react';
import useAsyncEffect from 'use-async-effect';
import { AuthContext } from './auth/authReducer';
import { useHistory } from './router';
import { initPushNotificationProcess } from './util/notificationUtils';

const NotificationInitializer: FunctionComponent = () => {
  const [initialized, setInitialized] = useState(false);
  const [authState] = useContext(AuthContext);
  const history = useHistory();
  useAsyncEffect(async () => {
    if (authState.profile?.webId && !initialized) {
      await initPushNotificationProcess({ history });
      setInitialized(true);
    }
  });
  return <Fragment />;
};

export default NotificationInitializer;
