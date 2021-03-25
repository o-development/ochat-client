import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { Toggle, Text } from '@ui-kitten/components';
import { Linking, Platform, View } from 'react-native';
import TextInput from '../../common/TextInput';
import { IChat, IChatParticipant, IChatType } from '../chatReducer';
import { AuthContext } from '../../auth/authReducer';
import { v4 } from 'uuid';
import FullPageSpinner from '../../common/FullPageSpinner';
import authFetch from '../../util/authFetch';
import BigButton from '../../common/BigButton';
import { useHistory } from '../../router';
import errorToast, { notificationToast } from '../../util/errorToast';
import {
  addParticipantToParticipantList,
  removeParticipantFromParticipantList,
} from './modifyParticipants';
import getThemeVars from '../../common/getThemeVars';
import ProfileSelector from './ProfileSelector';

const AdminSettings: FunctionComponent<{
  modifyingChat?: IChat;
  initialChatData?: Partial<IChat>;
  mobileRender?: boolean;
}> = ({ modifyingChat, initialChatData = {} }) => {
  const history = useHistory();
  const { themeColor } = getThemeVars();
  const [authState] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [
    userGaveInputToChatLocation,
    setUserGaveInputToChatLocation,
  ] = useState(!!modifyingChat);
  const [editedChat, setEditedChat] = useState<Partial<IChat>>(() => {
    if (modifyingChat) {
      return modifyingChat;
    } else if (authState.profile) {
      return {
        name: '',
        uri: `${authState.profile.defaultStorageLocation}${
          initialChatData.name ? encodeURIComponent(initialChatData.name) : v4()
        }/index.ttl`,
        type: IChatType.LongChat,
        images: [],
        participants: [
          {
            webId: authState.profile.webId,
            name: authState.profile.name,
            image: authState.profile.image,
            isAdmin: true,
          },
        ],
        isPublic: false,
        isDiscoverable: false,
        ...initialChatData,
      };
    }
    return {
      name: '',
      uri: `https://pod.example/chats/${
        initialChatData.name ? encodeURIComponent(initialChatData.name) : v4()
      }/index.ttl`,
      type: IChatType.LongChat,
      images: [],
      participants: [],
      isPublic: false,
      isDiscoverable: false,
      ...initialChatData,
    };
  });
  const [editChatDifference, setEditChatDifference] = useState<Partial<IChat>>(
    {},
  );

  if (!authState.profile) {
    return <FullPageSpinner />;
  }

  const addParticipant = (participant: IChatParticipant) => {
    editedChat.participants = addParticipantToParticipantList(
      editedChat.participants || [],
      participant,
    );
    setEditedChat({
      ...editedChat,
    });
    setEditChatDifference({
      ...editChatDifference,
      participants: editedChat.participants,
    });
  };

  function removeParticipant(participant: IChatParticipant) {
    editedChat.participants = removeParticipantFromParticipantList(
      editedChat.participants || [],
      participant,
    );
    setEditedChat({ ...editedChat, participants: editedChat.participants });
    setEditChatDifference({
      ...editChatDifference,
      participants: editedChat.participants,
    });
  }

  const updateChat = async () => {
    setLoading(true);
    if (modifyingChat) {
      const response = await authFetch(
        `/chat/${encodeURIComponent(modifyingChat.uri)}`,
        {
          method: 'put',
          body: JSON.stringify(editChatDifference),
          headers: {
            'content-type': 'application/json',
          },
        },
        { expectedStatus: 200 },
      );
      if (response.status === 200) {
        notificationToast('Chat Updated');
      }
    } else {
      const response = await authFetch(
        `/chat`,
        {
          method: 'post',
          body: JSON.stringify(editedChat),
          headers: {
            'content-type': 'application/json',
          },
        },
        {
          expectedStatus: 201,
          errorHandlers: {
            409: async (response: Response) => {
              try {
                const body = await response.json();
                history.push(
                  `/chat?id=${encodeURIComponent(body.metadata.uri)}`,
                );
              } catch (err) {
                errorToast(err.message);
              }
            },
          },
        },
      );
      if (response.status === 201) {
        const submittedChat = (await response.json()) as IChat;
        history.push(`/chat?id=${encodeURIComponent(submittedChat.uri)}`);
      }
    }
    setLoading(false);
  };

  return (
    <View style={{ zIndex: 1 }}>
      <TextInput
        placeholder="Chat with Friends"
        label="Chat Name"
        value={editedChat.name}
        onChangeText={(text) => {
          const updateObj: Partial<IChat> = { ...editedChat, name: text };
          if (!userGaveInputToChatLocation && !modifyingChat) {
            updateObj.uri = `${
              authState.profile?.defaultStorageLocation
            }${encodeURIComponent(text)}/index.ttl`;
          }
          setEditedChat(updateObj);
          setEditChatDifference({
            ...editChatDifference,
            name: updateObj.name,
          });
        }}
      />
      {!modifyingChat ? (
        <TextInput
          placeholder="https://pod.example/chats/"
          label="Chat Location"
          value={editedChat.uri}
          disabled={!!modifyingChat}
          onChangeText={(text) => {
            setUserGaveInputToChatLocation(true);
            setEditedChat({ ...editedChat, uri: text });
          }}
        />
      ) : (
        <View style={{ marginBottom: 12 }}>
          <Text category="label" appearance="hint">
            Chat Location
          </Text>
          <Text
            onPress={() => {
              if (editedChat.uri) {
                Platform.OS !== 'web'
                  ? Linking.openURL(editedChat.uri)
                  : window.open(editedChat.uri, '_blank');
              }
            }}
            style={{ textDecorationLine: 'underline', color: themeColor }}
          >
            {editedChat.uri}
          </Text>
        </View>
      )}
      <Toggle
        checked={editedChat.isPublic}
        style={{ alignSelf: 'flex-start', marginVertical: 16 }}
        onChange={(isChecked) => {
          setEditedChat({
            ...editedChat,
            isPublic: isChecked,
            isDiscoverable: false,
          });
          setEditChatDifference({
            ...editChatDifference,
            isPublic: isChecked,
            isDiscoverable: false,
          });
        }}
      >
        Public Chat?
      </Toggle>
      <Toggle
        checked={editedChat.isDiscoverable}
        style={{ alignSelf: 'flex-start', marginVertical: 16 }}
        disabled={!editedChat.isPublic}
        onChange={(isChecked) => {
          setEditedChat({
            ...editedChat,
            isDiscoverable: isChecked,
          });
          setEditChatDifference({
            ...editChatDifference,
            isDiscoverable: isChecked,
          });
        }}
      >
        Advertise chat in Discover Chats?
      </Toggle>
      <ProfileSelector
        value={editedChat.participants?.filter(
          (participant) => participant.isAdmin,
        )}
        isAdmin={true}
        onAdded={addParticipant}
        onRemoved={removeParticipant}
        label="Chat Administrators"
      />
      <ProfileSelector
        value={editedChat.participants?.filter(
          (participant) => !participant.isAdmin,
        )}
        isAdmin={false}
        onAdded={addParticipant}
        onRemoved={removeParticipant}
        label="Chat Participants"
      />
      <BigButton
        loading={loading}
        containerStyle={{ marginBottom: 16 }}
        appearance="primary"
        title={modifyingChat ? 'Update Chat' : 'Create Chat'}
        onPress={updateChat}
      />
    </View>
  );
};

export default AdminSettings;
