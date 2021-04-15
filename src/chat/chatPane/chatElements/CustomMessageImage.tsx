import { Text } from '@ui-kitten/components';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Image, View } from 'react-native';
import { MessageImage, MessageImageProps } from 'react-native-gifted-chat';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';

type ImageSize = {
  width: number;
  height: number;
} | null;

const DEFAULT_IMAGE_HEIGHT = 300;

const CustomMessageImage: FunctionComponent<
  MessageImageProps<IAugmentedGiftedChatMessage>
> = (props) => {
  const [rawImageSize, setRawImageSize] = useState<ImageSize>(null);
  const [rawBubbleWidth, setRawBubbleWidth] = useState<number | null>(null);

  useMemo(() => {
    if (props.currentMessage?.image) {
      Image.getSize(props.currentMessage?.image, (width, height) => {
        setRawImageSize({ width, height });
      });
    }
  }, [props.currentMessage?.image]);

  const imageDimensions = useMemo((): ImageSize => {
    if (!rawImageSize) {
      return null;
    }
    let dimensions: ImageSize;
    if (rawImageSize.height < DEFAULT_IMAGE_HEIGHT) {
      dimensions = rawImageSize;
    } else {
      const ratio = rawImageSize.height / DEFAULT_IMAGE_HEIGHT;
      const newWidth = rawImageSize.width / ratio;
      dimensions = { width: newWidth, height: DEFAULT_IMAGE_HEIGHT };
    }
    if (rawBubbleWidth && rawBubbleWidth < dimensions.width) {
      const ratio = dimensions.width / rawBubbleWidth;
      const newHeight = dimensions.height / ratio;
      dimensions = { width: rawBubbleWidth, height: newHeight };
    }
    return dimensions;
  }, [rawImageSize, rawBubbleWidth]);

  const handleLayout = useCallback((e) => {
    setRawBubbleWidth(e.nativeEvent.layout.width);
  }, []);

  if (!imageDimensions || !rawBubbleWidth) {
    return (
      <View
        onLayout={handleLayout}
        style={{
          margin: 10,
        }}
      >
        {/* This is a really stupid way to stretch to div out to measure it */}
        <Text>{`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   `}</Text>
      </View>
    );
  }

  return (
    <View style={{ width: '100%' }}>
      <MessageImage
        {...props}
        containerStyle={[props.containerStyle, { padding: 0, borderRadius: 0 }]}
        imageStyle={[
          props.imageStyle,
          {
            margin: 0,
            borderRadius: 15,
            ...imageDimensions,
            maxWidth: '100%',
            resizeMode: 'contain',
          },
        ]}
      />
    </View>
  );
};

export default CustomMessageImage;
