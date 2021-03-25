import { FunctionComponent } from 'react';

export interface ChatListProps {
  searchTerm?: string;
  currentlySelected?: string;
}

type ChatList = FunctionComponent<ChatListProps>;
export default ChatList;
