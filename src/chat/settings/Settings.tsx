import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { Toggle } from '@ui-kitten/components';
import { useHistory } from '../../router';
import BigButton from '../../common/BigButton';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import authFetch from '../../util/authFetch';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthActionType, AuthContext } from '../../auth/authReducer';
import useAsyncEffect from 'use-async-effect';
import {
  areNotificationsEnabled,
  removeNotificationPermission,
  requestNotificationPermission,
} from '../../util/notificationUtils';

const Settings: FunctionComponent<{
  mobileRender?: boolean;
}> = ({ mobileRender }) => {
  const history = useHistory();
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [, authDispatch] = useContext(AuthContext);

  useAsyncEffect(async () => {
    setNotificationToggle(await areNotificationsEnabled());
  });

  async function handleLogOut(shouldLogOutAll: boolean) {
    await Promise.all([
      authFetch(
        `/auth/logout/${shouldLogOutAll ? 'all' : 'device'}`,
        undefined,
        { expectedStatus: 204 },
      ).then((response) => {
        if (response.status === 204) {
          authDispatch({ type: AuthActionType.LOGGED_OUT });
          history.push('/');
        }
      }),
      AsyncStorage.removeItem('authkey'),
    ]);
  }

  return (
    <SettingsMenuTemplate
      title="Settings"
      mobileRender={mobileRender}
      backButton={true}
    >
      <Toggle
        style={{ marginVertical: 16 }}
        checked={notificationToggle}
        onChange={async (val) => {
          if (val) {
            setNotificationToggle(await requestNotificationPermission());
          } else {
            setNotificationToggle(await removeNotificationPermission());
          }
        }}
      >
        Notifications
      </Toggle>
      <BigButton
        appearance="ghost"
        title="Log Out of this Device"
        onPress={() => handleLogOut(false)}
      />
      <BigButton
        appearance="ghost"
        title="Log Out of all Devices"
        onPress={() => handleLogOut(true)}
      />
    </SettingsMenuTemplate>
  );
};

export default Settings;
