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
