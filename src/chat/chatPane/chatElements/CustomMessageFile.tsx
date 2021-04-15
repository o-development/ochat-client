import { Icon, Text } from '@ui-kitten/components';
import React, { FunctionComponent } from 'react';
import { Linking, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BubbleProps } from 'react-native-gifted-chat';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';

const CustomMessageFile: FunctionComponent<
  BubbleProps<IAugmentedGiftedChatMessage>
> = (props) => {
  if (props.currentMessage?.file) {
    const file = props.currentMessage?.file;
    const textColor = props.position === 'right' ? '#FFF' : '#000';
    const fileNameSplit = file.split('/');
    const fileName = fileNameSplit[fileNameSplit.length - 1];
    return (
      <TouchableOpacity
        onPress={() => {
          Platform.OS !== 'web'
            ? Linking.openURL(file)
            : window.open(file, '_blank');
        }}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Icon
          name="download-outline"
          fill={textColor}
          style={{ height: 24, width: 24, marginRight: 8 }}
        />
        <Text category="label" style={{ color: textColor }}>
          {fileName}
        </Text>
      </TouchableOpacity>
    );
  }
  return <></>;
};

export default CustomMessageFile;
