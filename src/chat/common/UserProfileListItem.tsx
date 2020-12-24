import { ListItem, ListItemProps } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import GroupImage from './GroupImage';

interface UserProfileListItem extends ListItemProps {
  name?: string;
  image?: string;
  avatarSize?: number | 'small' | 'medium' | 'large' | 'xlarge';
}

const UserProfileListItem: FunctionComponent<UserProfileListItem> = ({
  name,
  image,
  ...props
}) => {
  return (
    <ListItem
      {...props}
      title={name}
      accessoryLeft={() => (
        <View>
          <GroupImage images={image ? [image] : []} />
        </View>
      )}
    />
  );
};

export default UserProfileListItem;
