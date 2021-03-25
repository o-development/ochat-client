import React, { useCallback } from 'react';
import IProfile from '../../../auth/authReducer';
import { IChat } from '../../chatReducer';
import ChatList from './ChatListType';
import StandardChatList from './StandardChatList';

const DiscoverChatList: ChatList = ({ searchTerm, currentlySelected }) => {
  const filterFunction = useCallback((chat: IChat | IProfile) => {
    if (!(chat as IChat).participants) {
      return false;
    }
    return (chat as IChat).isDiscoverable || false;
  }, []);
  return (
    <StandardChatList
      searchTerm={searchTerm}
      currentlySelected={currentlySelected}
      listName="discover"
      chatFilterFunction={filterFunction}
    />
  );
};

export default DiscoverChatList;
