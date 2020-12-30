import { ListItem, ListItemProps } from '@ui-kitten/components';
import React, { FunctionComponent, useContext } from 'react';
import { View } from 'react-native';
import IProfile, { AuthContext } from '../../auth/authReducer';
import GroupImage from './GroupImage';

interface UserProfileListItem extends ListItemProps {
  profile?: Partial<IProfile>;
  name?: string;
  image?: string;
  avatarSize?: number | 'small' | 'medium' | 'large' | 'xlarge';
}

const UserProfileListItem: FunctionComponent<UserProfileListItem> = ({
  profile,
  name,
  image,
  ...props
}) => {
  const [authState] = useContext(AuthContext);
  const displayName =
    name ||
    `${profile?.name || 'User'}${
      profile?.webId === authState.profile?.webId ? ' (You)' : ''
    }`;
  const displayImages = image ? [image] : profile?.image ? [profile.image] : [];
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
};

export default UserProfileListItem;
