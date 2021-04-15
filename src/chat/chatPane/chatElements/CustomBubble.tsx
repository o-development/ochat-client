import { Text } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';
import {
  Bubble,
  BubbleProps,
  MessageImageProps,
  MessageVideoProps,
  TimeProps,
} from 'react-native-gifted-chat';
import getThemeVars from '../../../common/getThemeVars';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import UnverifiedMessageIndicator from '../UnverifiedMessageIndicator';
import CustomMessageFile from './CustomMessageFile';
import CustomMessageImage from './CustomMessageImage';
import CustomMessageVideo from './CustomMessageVideo';
import dayjs from 'dayjs';

const CustomBubble: FunctionComponent<
  BubbleProps<IAugmentedGiftedChatMessage>
> = (props) => {
  const { backgroundColor4, themeColor } = getThemeVars();
  const shouldSquishBubbles = useWindowDimensions().width < 700;
  const doNotDisplayBubble = !!(
    props.currentMessage?.image || props.currentMessage?.video
  );
  const commonWrapperStyle: ViewStyle = {
    padding: doNotDisplayBubble ? 0 : 10,
    maxWidth: shouldSquishBubbles ? '90%' : '55%',
  };
  if (doNotDisplayBubble) {
    commonWrapperStyle.backgroundColor = 'transparent';
  }
  const commonContainerStyle: ViewStyle = {
    marginVertical: 1,
    overflow: 'hidden',
  };
  return (
    <Bubble
      {...props}
      containerStyle={{
        left: commonContainerStyle,
        right: commonContainerStyle,
      }}
      wrapperStyle={{
        left: {
          backgroundColor: backgroundColor4,
          ...commonWrapperStyle,
        },
        right: { backgroundColor: themeColor, ...commonWrapperStyle },
      }}
      renderCustomView={() => {
        return (
          <>
            {props.currentMessage?.isInvalid ? (
              <UnverifiedMessageIndicator />
            ) : undefined}
            {props.currentMessage?.file ? (
              <CustomMessageFile {...props} />
            ) : undefined}
          </>
        );
      }}
      renderMessageVideo={(
        videoProps: MessageVideoProps<IAugmentedGiftedChatMessage>,
      ) => <CustomMessageVideo {...videoProps} />}
      renderMessageImage={(
        messageImageProps: MessageImageProps<IAugmentedGiftedChatMessage>,
      ) => <CustomMessageImage {...messageImageProps} />}
      renderTime={(timeProps: TimeProps<IAugmentedGiftedChatMessage>) => {
        const { currentMessage, timeFormat, position } = timeProps;
        if (doNotDisplayBubble) {
          return undefined;
        }
        return (
          <Text
            category="c1"
            style={{ color: position === 'left' ? '#000' : '#FFF' }}
          >
            {dayjs(currentMessage?.createdAt).locale('en').format(timeFormat)}
          </Text>
        );
      }}
    />
  );
};

export default CustomBubble;
