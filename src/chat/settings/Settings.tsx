import React, { useContext } from 'react';
import { FunctionComponent } from 'react';
import { Toggle } from '@ui-kitten/components';
import { useHistory } from '../../router';
import BigButton from '../../common/BigButton';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import authFetch from '../../util/authFetch';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthActionType, AuthContext } from '../../auth/authReducer';

const Settings: FunctionComponent<{
  mobileRender?: boolean;
}> = ({ mobileRender }) => {
  const history = useHistory();
  const [, authDispatch] = useContext(AuthContext);

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
    <SettingsMenuTemplate title="Settings" mobileRender={mobileRender}>
      <Toggle style={{ marginVertical: 16 }}>Notifications</Toggle>
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
