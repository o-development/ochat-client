import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { MessageVideoProps } from 'react-native-gifted-chat';
import { Video } from 'expo-av';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import { View } from 'react-native';
import getThemeVars from '../../../common/getThemeVars';
import { Text } from '@ui-kitten/components';

const MAX_HEIGHT = 300;
const WIDTH_FOR_MAX_HEIGHT = MAX_HEIGHT * (16 / 9);

type VideoSize = {
  width: number;
  height: number;
} | null;

const CustomMessageVideo: FunctionComponent<
  MessageVideoProps<IAugmentedGiftedChatMessage>
> = (props) => {
  const { dividerColor } = getThemeVars();
  const videoUri = props.currentMessage?.video;
  const [rawBubbleWidth, setRawBubbleWidth] = useState<number | null>(null);

  const videoSize: VideoSize = useMemo(() => {
    if (!rawBubbleWidth) {
      return null;
    }
    if (rawBubbleWidth * (9 / 16) > MAX_HEIGHT) {
      return { height: MAX_HEIGHT, width: WIDTH_FOR_MAX_HEIGHT };
    }
    return { width: rawBubbleWidth, height: rawBubbleWidth * (9 / 16) };
  }, [rawBubbleWidth]);

  const handleLayout = useCallback((e) => {
    setRawBubbleWidth(e.nativeEvent.layout.width);
  }, []);

  if (!videoUri) {
    return <></>;
  }
  if (!rawBubbleWidth || !videoSize) {
    return (
      <View onLayout={handleLayout}>
        {/* This is a really stupid way to stretch to div out to measure it */}
        <Text>{`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   `}</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        borderRadius: 15,
        overflow: 'hidden',
        borderColor: dividerColor,
        borderWidth: 1,
        height: videoSize.height,
        width: videoSize.width,
      }}
    >
      <Video
        source={{
          uri: videoUri,
        }}
        style={{ backgroundColor: dividerColor, width: '100%', height: '100%' }}
        useNativeControls
        resizeMode="contain"
      />
    </View>
  );
};

export default CustomMessageVideo;
