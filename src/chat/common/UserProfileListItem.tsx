import { ListItem, ListItemProps } from '@ui-kitten/components';
import React, { FunctionComponent, memo, useContext } from 'react';
import { View } from 'react-native';
import IProfile, { AuthContext } from '../../auth/authReducer';
import GroupImage from './GroupImage';

interface UserProfileListItem extends ListItemProps {
  profile?: Partial<IProfile>;
  name?: string;
  image?: string;
}

// eslint-disable-next-line react/display-name
const UserProfileListItem: FunctionComponent<UserProfileListItem> = memo(
  ({ profile, name, image, ...props }) => {
    const [authState] = useContext(AuthContext);
    const displayName =
      name ||
      `${profile?.name || 'User'}${
        profile?.webId === authState.profile?.webId ? ' (You)' : ''
      }`;
    const displayImages = image
      ? [image]
      : profile?.image
      ? [profile.image]
      : [];
    return (
      <ListItem
        {...props}
        title={displayName}
        accessoryLeft={() => (
          <View>
            <GroupImage images={displayImages} />
          </View>
        )}
      />
    );
  },
);

export default UserProfileListItem;
