import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
} from 'react';
import useAsyncEffect from 'use-async-effect';
import { ChatActionType, ChatContext, IChat, IMessage } from './chatReducer';
import { io, Socket } from 'socket.io-client';
import { API_WS_URL } from '@env';

// This is a load bearing console.info. Apparently the
// dotenv compiler plugin doesn't work properly without it
console.info('API_WS_URL', API_WS_URL);

export const SocketContext = createContext<Socket | undefined>(undefined);

const ChatSocketHandler: FunctionComponent = ({ children }) => {
  const [, chatDispatch] = useContext(ChatContext);

  const [activeSocket, setActiveSocket] = useState<Socket | undefined>(
    undefined,
  );

  useAsyncEffect(() => {
    // Setup Socket
    if (!activeSocket) {
      const socket = io(API_WS_URL, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.info('connected to socket.io');
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

      setActiveSocket(socket);

      return function cleanup() {
        socket.close();
      };
    }
  });

  return (
    <SocketContext.Provider value={activeSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export default ChatSocketHandler;
