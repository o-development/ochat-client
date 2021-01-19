import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { Toggle } from '@ui-kitten/components';
import { useHistory } from '../../router';
import BigButton from '../../common/BigButton';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import authFetch from '../../util/authFetch';
import * as SecureStore from 'expo-secure-store';
import { AuthActionType, AuthContext } from '../../auth/authReducer';
import useAsyncEffect from 'use-async-effect';
import {
  areNotificationsEnabled,
  disableNotifications,
  enableNotifications,
} from '../../util/notificationUtils';

const Settings: FunctionComponent<{
  mobileRender?: boolean;
}> = ({ mobileRender }) => {
  const history = useHistory();
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [, authDispatch] = useContext(AuthContext);
  const [checkedNotifications, setCheckedNotifications] = useState(false);

  useAsyncEffect(async () => {
    if (!checkedNotifications) {
      setNotificationToggle(await areNotificationsEnabled());
      setCheckedNotifications(true);
    }
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
      SecureStore.deleteItemAsync('authkey'),
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
            setNotificationToggle(await enableNotifications());
          } else {
            setNotificationToggle(!(await disableNotifications()));
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
