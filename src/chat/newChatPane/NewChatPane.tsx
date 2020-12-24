import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { Button, Icon, Text, Toggle } from '@ui-kitten/components';
import { View } from 'react-native';
import TextInput from '../../common/TextInput';
import ChipInput from '../../common/ChipInput';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import { IChat, IChatParticipant, IChatType } from '../chatReducer';
import MuteOptions from './MuteOptions';
import IProfile, { AuthContext } from '../../auth/authReducer';
import { v4 } from 'uuid';
import FullPageSpinner from '../../common/FullPageSpinner';
import authFetch from '../../util/authFetch';
import UserProfileListItem from '../common/UserProfileListItem';
import BigButton from '../../common/BigButton';
import { useHistory } from '../../router';
import { notificationToast } from '../../util/errorToast';

const NewChatPane: FunctionComponent<{
  modifyingChat?: IChat;
  onChatModificationClosed?: () => void;
  mobileRender?: boolean;
}> = ({
  modifyingChat,
  mobileRender,
  onChatModificationClosed = () => {
    /* nothing */
  },
}) => {
  const history = useHistory();
  const [authState] = useContext(AuthContext);
  if (!authState.profile) {
    return <FullPageSpinner />;
  }
  const [loading, setLoading] = useState(false);
  const [
    userGaveInputToChatLocation,
    setUserGaveInputToChatLocation,
  ] = useState(!!modifyingChat);
  const [editedChat, setEditedChat] = useState<Partial<IChat>>(
    modifyingChat || {
      name: '',
      uri: `${authState.profile.defaultStorageLocation}${v4()}/index.ttl`,
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
    },
  );
  const [editChatDifference, setEditChatDifference] = useState<Partial<IChat>>(
    {},
  );

  const addParticipant = (participant: IChatParticipant) => {
    editedChat.participants = editedChat.participants || [];
    const duplicateIndex = editedChat.participants.findIndex(
      (p) => p.webId === participant.webId,
    );
    if (duplicateIndex !== -1) {
      // If the participant is already present
      editedChat.participants[duplicateIndex].isAdmin = participant.isAdmin;
    } else {
      editedChat.participants.push(participant);
    }
    setEditedChat({
      ...editedChat,
    });
    setEditChatDifference({
      ...editChatDifference,
      participants: editedChat.participants,
    });
  };

  function removeParticipant(participant: IChatParticipant) {
    if (!editedChat.participants) {
      editedChat.participants = [];
    }
    if (participant.webId === authState.profile?.webId) {
      if (!confirm('Are you sure you want to remove yourself?')) {
        return;
      }
    }
    const participantIndex = editedChat.participants.findIndex(
      (p) => p.webId === participant.webId,
    );
    editedChat.participants.splice(participantIndex, 1);
    setEditedChat({ ...editedChat, participants: editedChat.participants });
    setEditChatDifference({
      ...editChatDifference,
      participants: editedChat.participants,
    });
  }

  async function searchParticipant(
    searchTerm: string,
    isAdmin: boolean,
  ): Promise<IChatParticipant[]> {
    const result = await authFetch(
      `/profile/search?term=${encodeURIComponent(searchTerm)}`,
      { method: 'post' },
      { expectedStatus: 200 },
    );
    if (result.status === 200) {
      const profiles = (await result.json()) as IProfile[];
      return profiles.map((profile) => ({
        webId: profile.webId,
        image: profile.image,
        name: profile.name,
        isAdmin,
      }));
    } else {
      return [];
    }
  }

  const renderParticipantChip = (
    item: IChatParticipant,
    onRemove: (item: IChatParticipant) => void,
  ) => {
    return (
      <UserProfileListItem
        name={item.name}
        image={item.image}
        accessoryRight={(props) => (
          <Button
            {...props}
            appearance="ghost"
            onPress={() => onRemove(item)}
            accessoryLeft={(props) => <Icon {...props} name="close-outline" />}
          />
        )}
        avatarSize={24}
      />
    );
  };

  const renderParticipantSearchResult = (
    item: IChatParticipant,
    onAdd: (item: IChatParticipant) => void,
  ) => {
    return (
      <UserProfileListItem
        name={`Add ${item.name} as ${
          item.isAdmin ? `an administrator` : `a participant`
        }`}
        image={item.image}
        onPress={() => onAdd(item)}
        avatarSize={24}
      />
    );
  };

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
        { expectedStatus: 201 },
      );
      if (response.status === 201) {
        const submittedChat = (await response.json()) as IChat;
        history.push(`/chat?id=${encodeURIComponent(submittedChat.uri)}`);
      }
    }
    setLoading(false);
  };

  return (
    <SettingsMenuTemplate
      title={modifyingChat ? `Update ${modifyingChat.name}` : 'New Chat'}
      closeButton={modifyingChat != undefined}
      backButton={modifyingChat == undefined}
      onCloseButton={onChatModificationClosed}
      mobileRender={mobileRender}
    >
      {modifyingChat ? <MuteOptions /> : undefined}
      <View>
        <Text category="h3" style={{ marginVertical: 16 }}>
          Chat Administrator Options
        </Text>

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
        <ChipInput<IChatParticipant>
          value={editedChat.participants?.filter(
            (participant) => participant.isAdmin,
          )}
          search={(text) => searchParticipant(text, true)}
          renderChip={renderParticipantChip}
          renderSearchResult={renderParticipantSearchResult}
          onAdded={addParticipant}
          onRemoved={removeParticipant}
          label="Chat Administrators"
          placeholder="Search names and WebIds to add administrators"
        />
        <ChipInput<IChatParticipant>
          value={editedChat.participants?.filter(
            (participant) => !participant.isAdmin,
          )}
          search={(text) => searchParticipant(text, false)}
          renderChip={renderParticipantChip}
          renderSearchResult={renderParticipantSearchResult}
          onAdded={addParticipant}
          onRemoved={removeParticipant}
          label="Chat Participants"
          placeholder="Search names and WebIds to add participants"
        />
        <Toggle
          checked={editedChat.isPublic}
          style={{ alignSelf: 'flex-start', marginVertical: 16 }}
          onChange={(isChecked) => {
            setEditedChat({ ...editedChat, isPublic: isChecked });
            setEditChatDifference({
              ...editChatDifference,
              isPublic: isChecked,
            });
          }}
        >
          Public Chat?
        </Toggle>
        <BigButton
          loading={loading}
          containerStyle={{ marginBottom: 16 }}
          appearance="primary"
          title={modifyingChat ? 'Update Chat' : 'Create Chat'}
          onPress={updateChat}
        />
      </View>
    </SettingsMenuTemplate>
  );
};

export default NewChatPane;
