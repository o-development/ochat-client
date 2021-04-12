import { Icon } from '@ui-kitten/components';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
  InputToolbar,
  InputToolbarProps,
  Send,
} from 'react-native-gifted-chat';
import getThemeVars from '../../../common/getThemeVars';
import CustomComposer from './CustomComposer';
import IMediaData from './mediaMenu/IMediaData';
import MediaMenu from './mediaMenu/MediaMenu';
import SelectedMedia from './mediaMenu/SelectedMedia';

const CustomInputToolbar: FunctionComponent<InputToolbarProps> = (
  parentProps,
) => {
  const { themeColor, dividerColor, backgroundColor1 } = getThemeVars();

  const [queuedMedia, setQueuedMedia] = useState<IMediaData[]>([]);
  const handleNewMedia = async (newMedia: IMediaData[]) => {
    setQueuedMedia((oldQueuedMedia) => oldQueuedMedia.concat(newMedia));
  };
  const handleRemoveMedia = useCallback(
    async (index: number) => {
      const newArr = [...queuedMedia];
      newArr.splice(index, 1);
      setQueuedMedia((oldQueuedMedia) => {
        const newArr = [...oldQueuedMedia];
        newArr.splice(index, 1);
        return newArr;
      });
    },
    [queuedMedia],
  );

  const renderAccessoryProp: Partial<InputToolbarProps> = {};
  if (queuedMedia.length > 0) {
    renderAccessoryProp.renderAccessory = function SelectedMediaFunc() {
      return (
        <SelectedMedia
          onNewMedia={handleNewMedia}
          onRemoveMedia={handleRemoveMedia}
          media={queuedMedia}
        />
      );
    };
  }

  return (
    <InputToolbar
      {...parentProps}
      containerStyle={[
        parentProps.containerStyle,
        {
          borderTopColor: dividerColor,
          backgroundColor: backgroundColor1,
        },
      ]}
      renderComposer={(props) => (
        <CustomComposer {...props} onNewMedia={handleNewMedia} />
      )}
      renderSend={(props) => {
        if (props.text || queuedMedia.length > 0) {
          return (
            <Send
              {...props}
              containerStyle={{ padding: 4, justifyContent: 'center' }}
            >
              <Icon
                style={{ width: 32, height: 32 }}
                name="arrow-circle-right"
                fill={themeColor}
              />
            </Send>
          );
        }
        return <MediaMenu onNewMedia={handleNewMedia} />;
      }}
      {...renderAccessoryProp}
    />
  );
};

export default CustomInputToolbar;
