import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import { Divider, Input, Icon } from '@ui-kitten/components';
import { useHistory } from '../../router';
import { View, Image } from 'react-native';
import ChatList from './chatLists/ChatListType';
import DefaultChatList from './chatLists/DefaultChatList';
import DiscoverChatList from './chatLists/DiscoverChatList';
import IconTextButton from '../../common/IconTextButton';

const ChatSelection: FunctionComponent<{
  currentlySelected?: string;
}> = ({ currentlySelected }) => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentListName, setCurrentListName] = useState('default');

  const componentMap: Record<string, ChatList> = {
    default: DefaultChatList,
    discover: DiscoverChatList,
  };

  const ChatListComponent: ChatList =
    componentMap[currentListName] || DefaultChatList;

  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            paddingTop: 4,
            paddingLeft: 4,
            paddingBottom: 4,
          }}
        >
          <Image
            source={require('../../../assets/splash.png')}
            style={{
              width: 155,
              height: 30,
            }}
          />
          <IconTextButton
            text="Settings"
            iconName="settings-2-outline"
            onPress={() => history.push('/chat/settings')}
          />
        </View>
        <Input
          placeholder="Search Chats"
          accessoryLeft={(props) => <Icon {...props} name="search-outline" />}
          style={{ borderColor: 'transparent', borderRadius: 0 }}
          onChangeText={async (term) => {
            setSearchTerm(term);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <IconTextButton
            iconName="message-circle-outline"
            text={currentListName === 'default' ? 'Discover Chats' : 'My Chats'}
            onPress={() =>
              setCurrentListName(
                currentListName === 'default' ? 'discover' : 'default',
              )
            }
          />
          <IconTextButton
            text="New Chat"
            iconName="plus-circle-outline"
            onPress={() => history.push('/chat/new')}
          />
        </View>
      </View>
      <Divider />
      <ChatListComponent
        currentlySelected={currentlySelected}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default ChatSelection;
