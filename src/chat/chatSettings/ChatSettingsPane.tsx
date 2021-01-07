import React from 'react';
import { FunctionComponent } from 'react';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import { IChat } from '../chatReducer';
import AdminSettings from './AdminSettings';

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
  return (
    <SettingsMenuTemplate
      title={`Update ${modifyingChat.name}`}
      closeButton={true}
      backButton={false}
      onCloseButton={onChatModificationClosed}
      mobileRender={mobileRender}
    >
      {/* {modifyingChat ? <MuteOptions /> : undefined} */}
      <AdminSettings
        modifyingChat={modifyingChat}
        mobileRender={mobileRender}
      />
    </SettingsMenuTemplate>
  );
};

export default ChatSettingsPane;
