import React from 'react';
import { FunctionComponent } from 'react';
import { Text } from '@ui-kitten/components';
import BigButton from '../../common/BigButton';
import { useHistory } from '../../router';
import DiscoverChatList from './chatLists/DiscoverChatList';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';

const NoChatSelectedPane: FunctionComponent = () => {
  const history = useHistory();
  return (
    <SettingsMenuTemplate title="">
      <Text category="h1" style={{ marginVertical: 8 }}>
        No Chat Selected
      </Text>
      <Text style={{ marginVertical: 8 }}>
        Select a chat from the menu on the left
      </Text>
      <Text style={{ marginVertical: 8, textAlign: 'center' }}>OR</Text>
      <BigButton
        containerStyle={{ marginVertical: 8 }}
        title="Create a New Chat"
        onPress={() => history.push('/chat/new')}
      />
      <Text style={{ marginVertical: 8, textAlign: 'center' }}>OR</Text>
      <Text style={{ marginVertical: 8 }}>Discover Public Chats:</Text>
      <DiscoverChatList />
    </SettingsMenuTemplate>
  );
};

export default NoChatSelectedPane;
