import { Icon } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { Platform } from 'react-native';
import {
  Composer,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import getThemeVars from '../../../common/getThemeVars';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import MediaMenu from './mediaMenu/MediaMenu';

const CustomInputToolbar: FunctionComponent<InputToolbarProps> = (
  parentProps,
) => {
  const {
    themeColor,
    dividerColor,
    backgroundColor1,
    basicTextColor,
  } = getThemeVars();

  // const queuedFiles = useState<DocumentResult>([]);

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
        <Composer
          {...props}
          textInputProps={{
            returnKeyType: 'send',
            onKeyPress: (e) => {
              if (Platform.OS === 'web') {
                if (
                  e.nativeEvent.key === 'Enter' &&
                  !((e.nativeEvent as unknown) as { shiftKey: boolean })
                    .shiftKey
                ) {
                  e.preventDefault();
                  const {
                    onSend,
                    text,
                  } = props as SendProps<IAugmentedGiftedChatMessage>;
                  if (text && onSend) {
                    onSend({ text: text.trim() }, true);
                  }
                }
              }
            },
            onSubmitEditing: () => {
              const {
                onSend,
                text,
              } = props as SendProps<IAugmentedGiftedChatMessage>;
              if (text && onSend) {
                onSend({ text: text.trim() }, true);
              }
            },
            blurOnSubmit: false,
          }}
          multiline={true}
          textInputStyle={[
            props.textInputStyle,
            {
              color: basicTextColor,
              fontSize: 15,
            },
          ]}
        />
      )}
      renderSend={(props) => {
        if (props.text) {
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
        return <MediaMenu />;
      }}
    />
  );
};

export default CustomInputToolbar;
