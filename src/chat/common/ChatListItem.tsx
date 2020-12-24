import { ListItem, ListItemProps } from '@ui-kitten/components';
import React, { FunctionComponent, useContext } from 'react';
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

const ChatListItem: FunctionComponent<ChatListItemProps> = ({
  chat,
  isSelected,
  onPress,
}) => {
  const { highlightColor } = getThemeVars();
  const [authState] = useContext(AuthContext);
  return (
    <ListItem
      title={chat.name}
      style={isSelected ? { backgroundColor: highlightColor } : {}}
      onPress={onPress}
      description={
        chat.lastMessage
          ? `${getParticipantForMessageSender(chat.lastMessage, chat).name}: ${
              chat.lastMessage.content
            }`
          : undefined
      }
      accessoryLeft={() => (
        <GroupImage
          images={chat.participants
            .filter((p) => !!p.image)
            .filter((p) => p.webId !== authState.profile?.webId)
            .map((p) => p.image as string)}
        />
      )}
    />
  );
};

export default ChatListItem;
