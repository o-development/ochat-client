import React, { useContext } from 'react';
import { FunctionComponent } from 'react';
import { IChat, IChatParticipant } from '../chatReducer';
import { Divider, Text } from '@ui-kitten/components';
import { View } from 'react-native';
import UserProfileListItem from '../common/UserProfileListItem';
import { getNewChatPaneUriFromProfile } from './getNewChatPaneUri';
import { useHistory } from '../../router';
import { AuthContext } from '../../auth/authReducer';
import Link from '../../common/Link';

const ChatParticipantDetails: FunctionComponent<{
  participants: IChatParticipant[];
}> = ({ participants }) => {
  const history = useHistory();
  const [authState] = useContext(AuthContext);
  return (
    <>
      {participants.map((participant) => (
        <UserProfileListItem
          key={participant.webId}
          profile={participant}
          onPress={() =>
            history.push(
              getNewChatPaneUriFromProfile(participant, authState.profile),
            )
          }
        />
      ))}
    </>
  );
};

const ChatDetails: FunctionComponent<{
  chat: IChat;
}> = ({ chat }) => {
  return (
    <View>
      <Text category="label">Chat Name:</Text>
      <Text>{chat.name}</Text>
      <Divider style={{ marginVertical: 8 }} />
      <Text category="label">Chat Location:</Text>
      <Link href={chat.uri} content={chat.uri} />
      <Divider style={{ marginVertical: 8 }} />
      <Text category="label">Public or Private:</Text>
      <Text>{chat.isPublic ? 'Public' : 'Private'}</Text>
      <Divider style={{ marginVertical: 8 }} />
      <Text category="label">Chat Administrators:</Text>
      <ChatParticipantDetails
        participants={chat.participants.filter((p) => p.isAdmin)}
      />
      <Divider style={{ marginVertical: 8 }} />
      <Text category="label">Chat Participants:</Text>
      <ChatParticipantDetails
        participants={chat.participants.filter((p) => !p.isAdmin)}
      />
    </View>
  );
};

export default ChatDetails;
