import React from 'react';
import { FunctionComponent } from 'react';
import { Button, ButtonProps, Icon, Spinner } from '@ui-kitten/components';
import getThemeVars from './getThemeVars';

interface IconButtonProps extends ButtonProps {
  iconName: string;
  loading?: boolean;
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  iconName,
  loading,
  ...restProps
}) => {
  const { themeColor } = getThemeVars();
  return (
    <Button
      {...restProps}
      appearance="ghost"
      size={'small'}
      style={{ width: 38, height: 38 }}
      accessoryLeft={(props) =>
        !loading ? (
          <Icon
            {...props}
            name={iconName}
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        ) : (
          <Spinner size="small" />
        )
      }
    />
  );
};

export default IconButton;
