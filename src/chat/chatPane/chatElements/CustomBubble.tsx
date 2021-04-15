import React, { FunctionComponent } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';
import {
  Bubble,
  BubbleProps,
  MessageImageProps,
} from 'react-native-gifted-chat';
import getThemeVars from '../../../common/getThemeVars';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import UnverifiedMessageIndicator from '../UnverifiedMessageIndicator';
import CustomMessageFile from './CustomMessageFile';
import CustomMessageImage from './CustomMessageImage';

const CustomBubble: FunctionComponent<
  BubbleProps<IAugmentedGiftedChatMessage>
> = (props) => {
  const { backgroundColor4, themeColor } = getThemeVars();
  const shouldSquishBubbles = useWindowDimensions().width < 700;
  const commonWrapperStyle: ViewStyle = {
    padding: props.currentMessage?.image ? 0 : 10,
    maxWidth: shouldSquishBubbles ? '90%' : '55%',
  };
  if (props.currentMessage?.image) {
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
      renderMessageImage={(
        messageImageProps: MessageImageProps<IAugmentedGiftedChatMessage>,
      ) => <CustomMessageImage {...messageImageProps} />}
    />
  );
};

export default CustomBubble;
