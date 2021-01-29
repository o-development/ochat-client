import { ListItem, ListItemProps, Text } from '@ui-kitten/components';
import React, { FunctionComponent, memo, useContext } from 'react';
import { StyleSheet } from 'react-native';
import getThemeVars from '../../common/getThemeVars';
import { IChat } from '../chatReducer';
import getParticipantForMessageSender from './getParticipantForMessageSender';
import GroupImage from '../common/GroupImage';
import { AuthContext } from '../../auth/authReducer';

interface ChatListItemProps extends ListItemProps {
  chat: IChat;
  isSelected?: boolean;
  avatarSize?: number | 'small' | 'medium' | 'large' | 'xlarge';
}

// eslint-disable-next-line react/display-name
const ChatListItem: FunctionComponent<ChatListItemProps> = memo(
  ({ chat, isSelected, onPress, ...props }) => {
    const { highlightColor } = getThemeVars();
    const [authState] = useContext(AuthContext);
    return (
      <ListItem
        {...props}
        title={(evaProps) => (
          <Text {...evaProps} numberOfLines={2}>
            {chat.name}
          </Text>
        )}
        style={StyleSheet.flatten([
          isSelected ? { backgroundColor: highlightColor } : {},
          props.style,
        ])}
        onPress={onPress}
        description={(evaProps) => (
          <Text {...evaProps} numberOfLines={2}>
            {chat.lastMessage
              ? `${
                  getParticipantForMessageSender(chat.lastMessage, chat).name
                }: ${chat.lastMessage.content}`
              : undefined}
          </Text>
        )}
        accessoryLeft={() => (
          <GroupImage
            images={chat.participants
              .filter((p) => !!p.image)
              .filter(
                (p) =>
                  chat.participants.length < 2 ||
                  p.webId !== authState.profile?.webId,
              )
              .map((p) => p.image as string)}
          />
        )}
      />
    );
  },
);

export default ChatListItem;
