import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import { View } from 'react-native';
import TextInput from '../../common/TextInput';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import BigButton from '../../common/BigButton';
import authFetch from '../../util/authFetch';
import { useHistory } from '../../router';
import errorToast from '../../util/errorToast';
import getErrorBody from '../../util/getErrorBody';

const LinkChatPane: FunctionComponent<{
  mobileRender?: boolean;
}> = ({ mobileRender }) => {
  const history = useHistory();
  const [chatUrl, setChatUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const linkChats = async () => {
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
  };

  return (
    <SettingsMenuTemplate
      title="Link an existing Solid Chat"
      mobileRender={mobileRender}
    >
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
      </View>
    </SettingsMenuTemplate>
  );
};

export default LinkChatPane;
