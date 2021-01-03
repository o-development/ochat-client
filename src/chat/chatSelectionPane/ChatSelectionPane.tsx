import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { Layout, List, Divider, Input, Icon } from '@ui-kitten/components';
import { useHistory } from '../../router';
import getThemeVars from '../../common/getThemeVars';
import { View, Image } from 'react-native';
import BigButton from '../../common/BigButton';
import { IChat } from '../chatReducer';
import useAsyncEffect from 'use-async-effect';
import authFetch from '../../util/authFetch';
import { ChatContext, ChatActionType } from '../chatReducer';
import FullPageSpinner from '../../common/FullPageSpinner';
import IProfile, { AuthContext } from '../../auth/authReducer';
import UserProfileListItem from '../common/UserProfileListItem';
import ChatListItem from '../common/ChatListItem';
import getNewChatPaneUri from '../chatSettings/getNewChatPaneUri';

const ChatSelectionPane: FunctionComponent<{
  mobileRender?: boolean;
  currentlySelected?: string;
}> = ({ mobileRender, currentlySelected }) => {
  const { dividerColor, backgroundColor1 } = getThemeVars();
  const history = useHistory();
  const [chatState, chatDispatch] = useContext(ChatContext);
  const chats = chatState.chats;

  const [authState] = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chatSearchResults, setChatSearchResults] = useState<IChat[]>([]);
  const [profileSearchResults, setProfileSearchResults] = useState<IProfile[]>(
    [],
  );
  const [searchResultsLoading, setSearchResultsLoading] = useState<boolean>(
    false,
  );

  useAsyncEffect(async () => {
    if (!chatState.performedActions['initialChatListFetch']) {
      const result = await authFetch(
        `/chat/search`,
        {
          method: 'post',
        },
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody: {
          chats: IChat[];
          profiles?: IProfile[];
        } = await result.json();
        chatDispatch({
          type: ChatActionType.UPDATE_CHAT,
          chats: resultBody.chats,
          performedAction: 'initialChatListFetch',
        });
      }
    }
  });

  if (!authState.profile) {
    return <FullPageSpinner />;
  }

  const handleSearchTermChange = async (newTerm: string) => {
    setSearchTerm(newTerm);
    if (newTerm) {
      setSearchResultsLoading(true);
      const result = await authFetch(
        `/chat/search?term=${newTerm}}`,
        {
          method: 'post',
        },
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody: {
          chats: IChat[];
          profiles?: IProfile[];
        } = await result.json();
        setChatSearchResults(resultBody.chats);
        setProfileSearchResults(resultBody.profiles || []);
      }
      setSearchResultsLoading(false);
    }
  };

  const chatList: (IChat | IProfile)[] = !searchTerm
    ? (Object.values(chats)
        .map((chatData) => chatData.chat)
        .filter((chat): boolean => {
          if (!chat) {
            return false;
          }
          return chat.participants.some(
            (participant) => participant.webId === authState.profile?.webId,
          );
        }) as IChat[]).sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) {
          return 0;
        } else if (!a.lastMessage) {
          return 1;
        } else if (!b.lastMessage) {
          return -1;
        }
        const aTime = a.lastMessage.timeCreated;
        const bTime = b.lastMessage.timeCreated;
        if (aTime > bTime) {
          return -1;
        } else if (aTime < bTime) {
          return 1;
        } else {
          return 0;
        }
      })
    : [...chatSearchResults, ...profileSearchResults];

  return (
    <Layout
      style={{
        borderRightColor: dividerColor,
        borderRightWidth: mobileRender ? 0 : 1,
        height: '100%',
      }}
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            padding: 4,
          }}
        >
          <Image
            source={require('../../../assets/splash.png')}
            style={{
              width: 155,
              height: 30,
            }}
          />
          <BigButton
            appearance="ghost"
            title="Settings"
            onPress={() => history.push('/chat/settings')}
          />
        </View>
        <Input
          placeholder="Search Chats"
          accessoryLeft={(props) => <Icon {...props} name="search-outline" />}
          style={{ borderColor: 'transparent', borderRadius: 0 }}
          onChangeText={handleSearchTermChange}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <BigButton
            appearance="ghost"
            title="Link Chat"
            onPress={() => history.push('/chat/link')}
          />
          <BigButton
            appearance="ghost"
            title="New Chat"
            onPress={() => history.push('/chat/new')}
          />
        </View>
      </View>
      <Divider />
      {searchResultsLoading ? (
        <FullPageSpinner />
      ) : (
        <List<IChat | IProfile>
          data={chatList}
          ItemSeparatorComponent={Divider}
          style={{ backgroundColor: backgroundColor1 }}
          renderItem={(listData: { item: IChat | IProfile }) => {
            if ((listData.item as IChat).uri) {
              const chat = listData.item as IChat;
              return (
                <ChatListItem
                  chat={chat}
                  isSelected={!!chat.uri && chat.uri === currentlySelected}
                  onPress={() =>
                    history.push(`/chat?id=${encodeURIComponent(chat.uri)}`)
                  }
                />
              );
            } else {
              const profile = listData.item as IProfile;
              return (
                <UserProfileListItem
                  profile={profile}
                  onPress={() =>
                    history.push(
                      getNewChatPaneUri({
                        name:
                          profile.webId ===
                          (authState.profile as IProfile).webId
                            ? 'Personal Chat'
                            : `${profile.name || 'User'} & ${
                                authState.profile?.name || 'User'
                              }`,
                        participants: [profile.webId],
                        administrators: [(authState.profile as IProfile).webId],
                      }),
                    )
                  }
                  avatarSize="medium"
                />
              );
            }
          }}
        />
      )}
    </Layout>
  );
};

export default ChatSelectionPane;
