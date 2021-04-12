import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import getThemeVars from '../../../../common/getThemeVars';
import IMediaData from './IMediaData';
import MediaMenu from './MediaMenu';
import MediaPill from './MediaPill';

interface ISelectedMediaProps {
  onNewMedia(newMedia: IMediaData[]): void;
  onRemoveMedia(index: number): void;
  media: IMediaData[];
}

const SelectedMedia: FunctionComponent<ISelectedMediaProps> = ({
  media,
  onNewMedia,
  onRemoveMedia,
}) => {
  const { dividerColor } = getThemeVars();

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 44,
        width: '100%',
      }}
    >
      <ScrollView
        style={{
          flexDirection: 'row',
          flex: 1,
          paddingLeft: 4,
          paddingVertical: 4,
        }}
        horizontal={true}
      >
        {media.map((mediaData, index) => (
          <MediaPill
            key={mediaData.identifier}
            mediaData={mediaData}
            onRemove={() => onRemoveMedia(index)}
          />
        ))}
      </ScrollView>

      <MediaMenu
        onNewMedia={onNewMedia}
        style={{ borderLeftWidth: 1, borderLeftColor: dividerColor }}
      />
    </View>
  );
};

export default SelectedMedia;
