import { Button, Icon, Text } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { Image, View } from 'react-native';
import getThemeVars from '../../../../common/getThemeVars';
import IMediaData, { IMediaType } from './IMediaData';

interface MediaPillProps {
  mediaData: IMediaData;
  onRemove: () => void;
}

const MediaPill: FunctionComponent<MediaPillProps> = ({
  mediaData,
  onRemove,
}) => {
  const { highlightColor, basicTextColor } = getThemeVars();

  return (
    <View
      style={{
        backgroundColor: highlightColor,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 4,
      }}
    >
      {mediaData.type === IMediaType.image ? (
        <Image
          source={{ uri: mediaData.content.uri }}
          style={{ width: 36, height: 36 }}
        />
      ) : undefined}
      {mediaData.type === IMediaType.file ? (
        <>
          <Icon
            fill={basicTextColor}
            name="attach-outline"
            style={{ width: 16, height: 16, marginHorizontal: 8 }}
          />
          <Text category="label">{mediaData.name || 'File'}</Text>
        </>
      ) : undefined}
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 32 }}
        onPress={() => {
          onRemove();
        }}
        accessoryLeft={(props) => (
          <Icon {...props} fill={basicTextColor} name="close-outline" />
        )}
      />
    </View>
  );
};

export default MediaPill;
