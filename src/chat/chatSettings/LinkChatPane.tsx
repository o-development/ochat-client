import React, { useCallback, useState } from 'react';
import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';
import TextInput from '../../common/TextInput';
import BigButton from '../../common/BigButton';
import authFetch from '../../util/authFetch';
import { useHistory } from '../../router';
import errorToast, { notificationToast } from '../../util/errorToast';
import getErrorBody from '../../util/getErrorBody';

const LinkChatPane: FunctionComponent = () => {
  const history = useHistory();
  const [chatUrl, setChatUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [allChatsLoading, setAllChatsLoading] = useState(false);

  const linkChats = useCallback(async () => {
    setLoading(true);
    const result = await authFetch(
      `/chat/${encodeURIComponent(chatUrl)}`,
      {
        method: 'post',
      },
      {
        expectedStatus: 201,
        errorHandlers: {
          '409': async (response) => {
            // If there is a conflict, proceed to the chat
            const resultBody = await getErrorBody(response);
            if (resultBody && resultBody.metadata.uri) {
              history.push(
                `/chat/?id=${encodeURIComponent(resultBody.metadata.uri)}`,
              );
              return;
            } else {
              errorToast('Unexpected Conflict');
            }
          },
        },
      },
    );
    if (result.status === 201) {
      const resultBody = await result.json();
      history.push(`/chat/?id=${encodeURIComponent(resultBody.uri)}`);
      return;
    }
    setLoading(false);
  }, [chatUrl, history]);

  const linkAllChatsOnPod = useCallback(async () => {
    setAllChatsLoading(true);
    const result = await authFetch(
      '/chat/authenticated',
      { method: 'POST' },
      { expectedStatus: 201 },
    );
    if (result.status === 201) {
      notificationToast('All chats successfully linked.');
    }
    setAllChatsLoading(false);
  }, []);

  return (
    <View>
      <TextInput
        placeholder="https://pod.example/chat/index.ttl#this"
        label="Chat Uri"
        value={chatUrl}
        onChangeText={setChatUrl}
      />
      <BigButton
        loading={loading}
        appearance="primary"
        title="Link Chat"
        onPress={linkChats}
      />
      <Text style={{ textAlign: 'center', marginVertical: 8 }}>OR</Text>
      <BigButton
        loading={allChatsLoading}
        appearance="primary"
        title="Link all chats in your Pod"
        onPress={linkAllChatsOnPod}
      />
    </View>
  );
};

export default LinkChatPane;
