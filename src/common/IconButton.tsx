import React from 'react';
import { FunctionComponent } from 'react';
import { Button, ButtonProps, Icon } from '@ui-kitten/components';
import getThemeVars from './getThemeVars';

interface IconButtonProps extends ButtonProps {
  iconName: string;
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  iconName,
  ...restProps
}) => {
  const { themeColor } = getThemeVars();
  return (
    <Button
      {...restProps}
      appearance="ghost"
      size={'small'}
      style={{ width: 38, height: 38 }}
      accessoryLeft={(props) => (
        <Icon
          {...props}
          name={iconName}
          fill={themeColor}
          style={{ height: 28, width: 28 }}
        />
      )}
    />
  );
};

export default IconButton;
