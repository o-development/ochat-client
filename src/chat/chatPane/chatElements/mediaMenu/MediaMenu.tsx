import { Button, Icon } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import getThemeVars from '../../../../common/getThemeVars';

const MediaMenu: FunctionComponent = () => {
  const { themeColor } = getThemeVars();

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
      }}
    >
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 38, height: 44 }}
        onPress={() => console.log('camera')}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="camera-outline"
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        )}
      />
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 38, height: 44 }}
        onPress={() => console.log('image')}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="image-outline"
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        )}
      />
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 38, height: 44 }}
        onPress={() => console.log('file')}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="attach-outline"
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        )}
      />
    </View>
  );
};

export default MediaMenu;
