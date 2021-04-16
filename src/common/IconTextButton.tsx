import React from 'react';
import { FunctionComponent } from 'react';
import { Button, ButtonProps, Icon, Text } from '@ui-kitten/components';
import getThemeVars from './getThemeVars';

interface IconTextButtonProps extends ButtonProps {
  iconName: string;
  text: string;
}

const IconTextButton: FunctionComponent<IconTextButtonProps> = ({
  iconName,
  text,
  ...restProps
}) => {
  const { themeColor } = getThemeVars();
  return (
    <Button
      {...restProps}
      size="small"
      appearance="ghost"
      style={{ paddingRight: 0 }}
      accessoryLeft={(props) => (
        <Icon
          {...props}
          name={iconName}
          fill={themeColor}
          style={{ height: 16, width: 16 }}
        />
      )}
    >
      {text}
    </Button>
  );
};

export default IconTextButton;
