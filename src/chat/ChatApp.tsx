import React, { FunctionComponent } from 'react';
import ChatAppLayout from './ChatAppLayout';
import { ChatProvider } from './chatReducer';
import ChatSocketHandler from './ChatSocketHandler';

const ChatApp: FunctionComponent = () => {
  // On a browser or tablet
  return (
    <ChatProvider>
      <ChatSocketHandler />
      <ChatAppLayout />
    </ChatProvider>
  );
};

export default ChatApp;
