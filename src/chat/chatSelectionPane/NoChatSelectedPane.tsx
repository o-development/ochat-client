import React from 'react';
import { FunctionComponent } from 'react';
import { Text, Layout } from '@ui-kitten/components';
import BigButton from '../../common/BigButton';
import { useHistory } from '../../router';

const NoChatSelectedPane: FunctionComponent = () => {
  const history = useHistory();
  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text category="h1" style={{ marginVertical: 8 }}>
        No Chat Selected
      </Text>
      <Text style={{ marginVertical: 8 }}>
        Select a chat from the menu on the left
      </Text>
      <Text style={{ marginVertical: 8 }}>OR</Text>
      <BigButton
        containerStyle={{ marginVertical: 8 }}
        title="Create a New Chat"
        onPress={() => history.push('/chat/new')}
      />
      <Text style={{ marginVertical: 8 }}>OR</Text>
      <BigButton
        containerStyle={{ marginVertical: 8 }}
        title="Link an existing Solid Chat"
        onPress={() => history.push('/chat/link')}
      />
    </Layout>
  );
};

export default NoChatSelectedPane;
