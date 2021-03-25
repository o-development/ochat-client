import React, { useCallback, useContext } from 'react';
import IProfile, { AuthContext } from '../../../auth/authReducer';
import { IChat } from '../../chatReducer';
import ChatList from './ChatListType';
import StandardChatList from './StandardChatList';

const DefaultChatList: ChatList = ({ searchTerm, currentlySelected }) => {
  const [authState] = useContext(AuthContext);
  const filterFunction = useCallback(
    (chat: IChat | IProfile) => {
      if (!(chat as IChat).participants) {
        return false;
      }
      return (chat as IChat).participants.some(
        (participant) => participant.webId === authState.profile?.webId,
      );
    },
    [authState.profile?.webId],
  );
  return (
    <StandardChatList
      searchTerm={searchTerm}
      currentlySelected={currentlySelected}
      listName="default"
      chatFilterFunction={filterFunction}
    />
  );
};

export default DefaultChatList;
