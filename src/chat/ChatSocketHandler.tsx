import React, {
  Fragment,
  FunctionComponent,
  useContext,
  useState,
} from 'react';
import useAsyncEffect from 'use-async-effect';
import { ChatActionType, ChatContext, IChat, IMessage } from './chatReducer';
import { io } from 'socket.io-client';
import { API_WS_URL } from '@env';

const ChatSocketHandler: FunctionComponent = () => {
  const [, chatDispatch] = useContext(ChatContext);

  const [didSetUpSocket, setDidSetUpSocket] = useState(false);
  useAsyncEffect(() => {
    if (!didSetUpSocket) {
      setDidSetUpSocket(true);

      const socket = io(API_WS_URL, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('connected to socket.io');
      });

      socket.on('message', (chatId: string, messages: IMessage[]) => {
        chatDispatch({
          type: ChatActionType.ADD_MESSAGE,
          message: messages,
          chatId,
        });
      });

      socket.on('chat', (chatId: string, chat: IChat) => {
        chatDispatch({
          type: ChatActionType.UPDATE_CHAT,
          chats: [chat],
        });
      });

      return function cleanup() {
        socket.close();
      };
    }
  });

  return <Fragment />;
};

export default ChatSocketHandler;
