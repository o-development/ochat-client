import React, { FunctionComponent, useCallback, useState } from 'react';
import {
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat';
import getThemeVars from '../../../common/getThemeVars';
import IconButton from '../../../common/IconButton';
import { uploadMedia } from './mediaMenu/uploadUtils';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import CustomComposer from './CustomComposer';
import IMediaData, { IMediaType } from './mediaMenu/IMediaData';
import MediaMenu from './mediaMenu/MediaMenu';
import SelectedMedia from './mediaMenu/SelectedMedia';

const CustomInputToolbar: FunctionComponent<
  InputToolbarProps &
    SendProps<IAugmentedGiftedChatMessage> & { chatUri: string }
> = (parentProps) => {
  const { dividerColor, backgroundColor1 } = getThemeVars();

  // Media
  const [queuedMedia, setQueuedMedia] = useState<IMediaData[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
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
    if (isUploadingMedia) {
      return;
    }
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
        setIsUploadingMedia(true);
        const uploadedMedia: {
          type: IMediaType;
          uri: string;
        }[] = await Promise.all(
          queuedMedia.map(async (media) => {
            return {
              uri: await uploadMedia(media, parentProps.chatUri),
              type: media.type,
            };
          }),
        );
        console.log('uploadedMedia');
        console.log(uploadedMedia);
        messages = messages.concat(
          uploadedMedia.map((uploadedItem) => {
            return uploadedItem.type === IMediaType.image
              ? { image: uploadedItem.uri, text: uploadedItem.uri }
              : { text: uploadedItem.uri };
          }),
        );
        setIsUploadingMedia(false);
        setQueuedMedia([]);
      }

      // Send Messages
      if (parentProps.onSend) {
        parentProps.onSend(messages, true);
      }
    }
  }, [isUploadingMedia, parentProps, queuedMedia]);

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
              loading={isUploadingMedia}
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
