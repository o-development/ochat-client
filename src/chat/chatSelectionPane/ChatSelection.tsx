import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import { Divider, Input, Icon } from '@ui-kitten/components';
import { useHistory } from '../../router';
import { View, Image } from 'react-native';
import BigButton from '../../common/BigButton';
import ChatList from './chatLists/ChatListType';
import DefaultChatList from './chatLists/DefaultChatList';
import DiscoverChatList from './chatLists/DiscoverChatList';

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
          <BigButton
            appearance="ghost"
            title={
              currentListName === 'default' ? 'Discover Chats' : 'My Chats'
            }
            onPress={() =>
              setCurrentListName(
                currentListName === 'default' ? 'discover' : 'default',
              )
            }
          />
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
      <ChatListComponent
        currentlySelected={currentlySelected}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default ChatSelection;
