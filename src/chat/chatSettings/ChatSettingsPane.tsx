import React, { useContext } from 'react';
import { FunctionComponent } from 'react';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import { IChat } from '../chatReducer';
import AdminSettings from './AdminSettings';
import { AuthContext } from '../../auth/authReducer';
import ChatDetails from './ChatDetails';
import MuteOptions from './MuteOptions';
import { Text } from '@ui-kitten/components';

const ChatSettingsPane: FunctionComponent<{
  modifyingChat: IChat;
  onChatModificationClosed?: () => void;
  mobileRender?: boolean;
}> = ({
  modifyingChat,
  mobileRender,
  onChatModificationClosed = () => {
    /* nothing */
  },
}) => {
  const [authState] = useContext(AuthContext);
  const curUserIsAdmin = modifyingChat.participants.some(
    (p) => p.webId === authState.profile?.webId && p.isAdmin,
  );
  return (
    <SettingsMenuTemplate
      title={`Update ${modifyingChat.name}`}
      closeButton={true}
      backButton={false}
      onCloseButton={onChatModificationClosed}
      mobileRender={mobileRender}
    >
      {modifyingChat ? <MuteOptions chatUri={modifyingChat.uri} /> : undefined}
      {modifyingChat ? (
        <Text category="h3" style={{ marginVertical: 16 }}>
          Admin Options
        </Text>
      ) : undefined}
      {curUserIsAdmin ? (
        <AdminSettings
          modifyingChat={modifyingChat}
          mobileRender={mobileRender}
        />
      ) : (
        <ChatDetails chat={modifyingChat} />
      )}
    </SettingsMenuTemplate>
  );
};

export default ChatSettingsPane;
