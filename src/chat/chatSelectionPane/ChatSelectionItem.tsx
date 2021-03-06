import React, { FunctionComponent, memo, useCallback, useContext } from 'react';
import { ListRenderItemInfo } from 'react-native';
import IProfile, { AuthContext } from '../../auth/authReducer';
import { useHistory } from '../../router';
import { IChat } from '../chatReducer';
import { getNewChatPaneUriFromProfile } from '../chatSettings/getNewChatPaneUri';
import ChatListItem from '../common/ChatListItem';
import UserProfileListItem from '../common/UserProfileListItem';

interface ChatSelectionItemProps {
  currentlySelected?: string;
}

const ChatSelectionItem: FunctionComponent<
  ListRenderItemInfo<IChat | IProfile> & ChatSelectionItemProps
  // eslint-disable-next-line react/display-name
> = memo((listData) => {
  const history = useHistory();
  const [authState] = useContext(AuthContext);

  const isChat = !!(listData.item as IChat).uri;

  const chat = listData.item as IChat;
  const onChatListItemPress = useCallback(() => {
    history.push(`/chat?id=${encodeURIComponent(chat.uri)}`);
  }, [history, chat.uri]);

  const profile = listData.item as IProfile;
  const onUserProfileItemPress = useCallback(() => {
    history.push(
      getNewChatPaneUriFromProfile(profile, authState.profile as IProfile),
    );
  }, [history, profile, authState.profile]);

  if (isChat) {
    const chat = listData.item as IChat;
    return (
      <ChatListItem
        style={{ height: 72 }}
        chat={chat}
        isSelected={!!chat.uri && chat.uri === listData.currentlySelected}
        onPress={onChatListItemPress}
      />
    );
  } else {
    const profile = listData.item as IProfile;
    return (
      <UserProfileListItem profile={profile} onPress={onUserProfileItemPress} />
    );
  }
});

export default ChatSelectionItem;
