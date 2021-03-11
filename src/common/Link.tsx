import { Text } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { Linking, Platform } from 'react-native';
import getThemeVars from './getThemeVars';

export interface LinkProps {
  href: string;
  content: string;
}

const Link: FunctionComponent<LinkProps> = ({ href, content }) => {
  const { themeColor } = getThemeVars();
  return (
    <Text
      accessibilityRole="link"
      // The typings for the Text object is incorrect; href is an allowable prop
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      href={href}
      onPress={() =>
        Platform.OS !== 'web'
          ? Linking.openURL(href)
          : window.open(href, '_blank')
      }
      style={{ textDecorationLine: 'underline', color: themeColor }}
    >
      {content}
    </Text>
  );
};

export default Link;
