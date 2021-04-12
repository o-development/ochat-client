import { Icon } from '@ui-kitten/components';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import {
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import getThemeVars from '../../../common/getThemeVars';
import IconButton from '../../../common/IconButton';
import authFetch from '../../../util/authFetch';
import uploadMedia from '../../chatFunctions/uploadMedia';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import CustomComposer from './CustomComposer';
import IMediaData from './mediaMenu/IMediaData';
import MediaMenu from './mediaMenu/MediaMenu';
import SelectedMedia from './mediaMenu/SelectedMedia';

const CustomInputToolbar: FunctionComponent<
  InputToolbarProps & SendProps<IAugmentedGiftedChatMessage>
> = (parentProps) => {
  const { themeColor, dividerColor, backgroundColor1 } = getThemeVars();

  // Media
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

  // Send media before send message
  const sendMediaAndMessage = useCallback(async () => {
    const text = parentProps.text;
    if (text || queuedMedia.length > 0) {
      // Create Messages
      let messages: Partial<IAugmentedGiftedChatMessage>[] = [];
      if (parentProps.text) {
        messages.push({
          text: parentProps.text,
        });
      }
      // Upload Media
      if (queuedMedia.length > 0) {
        const mediaMessages: Partial<IAugmentedGiftedChatMessage>[] = await Promise.all(
          queuedMedia.map(async (media) => {
            return uploadMedia(media);
          }),
        );
        messages = messages.concat(mediaMessages);
      }
      console.log('done');

      // Send Messages
      // if (parentProps.onSend) {
      //   parentProps.onSend(messages, true);
      // }
    }
  }, [parentProps.text, queuedMedia]);

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
        <CustomComposer
          {...props}
          onNewMedia={handleNewMedia}
          customOnSend={sendMediaAndMessage}
        />
      )}
      renderSend={(props) => {
        if (props.text || queuedMedia.length > 0) {
          return (
            <IconButton
              iconName="arrow-circle-right"
              onPress={sendMediaAndMessage}
            />
          );
        }
        return <MediaMenu onNewMedia={handleNewMedia} />;
      }}
      {...renderAccessoryProp}
    />
  );
};

export default CustomInputToolbar;
