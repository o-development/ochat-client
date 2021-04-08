import { Button, Icon, MenuItem, OverflowMenu } from '@ui-kitten/components';
import React, { FunctionComponent, useContext, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useHistory } from 'react-router';
import IProfile, { AuthContext } from '../../auth/authReducer';
import getThemeVars from '../../common/getThemeVars';
import errorToast from '../../util/errorToast';
import { getNewChatPaneUriFromProfile } from '../chatSettings/getNewChatPaneUri';

interface UserProfileActionsMenu {
  profile?: Partial<IProfile>;
}

const UserProfileActionsMenu: FunctionComponent<UserProfileActionsMenu> = ({
  profile,
}) => {
  const history = useHistory();
  const { basicTextColor } = getThemeVars();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authState] = useContext(AuthContext);

  return (
    <OverflowMenu
      anchor={() => (
        <Button
          appearance="ghost"
          size={'small'}
          style={{ width: 32 }}
          onPress={() => setIsMenuOpen(true)}
          accessoryLeft={(props) => (
            <Icon
              {...props}
              name="more-vertical-outline"
              fill={basicTextColor}
            />
          )}
        />
      )}
      visible={isMenuOpen}
      onBackdropPress={() => setIsMenuOpen(false)}
      placement="bottom end"
    >
      <MenuItem
        title="View WebId"
        onPress={() => {
          const webId = profile?.webId;
          if (!webId) {
            errorToast('Could not get profile WebId');
            return;
          }
          Platform.OS !== 'web'
            ? Linking.openURL(webId)
            : window.open(webId, '_blank');
        }}
      />
      <MenuItem
        title="Start a chat"
        onPress={() => {
          history.push(
            getNewChatPaneUriFromProfile(
              profile as IProfile,
              authState.profile,
            ),
          );
        }}
      />
    </OverflowMenu>
  );
};

export default UserProfileActionsMenu;
