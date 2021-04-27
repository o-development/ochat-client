import {
  MenuGroup,
  MenuGroupProps,
  MenuItemProps,
} from '@ui-kitten/components';
import React, { FunctionComponent, ReactNode } from 'react';
import { View } from 'react-native';

const MenuItemWrapper: FunctionComponent<
  MenuItemProps & { content: ReactNode }
> = ({ content }) => {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>{content}</View>
  );
};

const Collapsable: FunctionComponent<MenuGroupProps> = ({
  children,
  ...props
}) => {
  return (
    <MenuGroup {...props}>
      <MenuItemWrapper content={children} />
    </MenuGroup>
  );
};

export default Collapsable;
