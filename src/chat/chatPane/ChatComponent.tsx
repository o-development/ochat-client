import React, { useCallback, useContext, useMemo, useState } from 'react';
import { FunctionComponent } from 'react';
import { Text } from '@ui-kitten/components';
import getThemeVars from '../../common/getThemeVars';
import { GiftedChat } from 'react-native-gifted-chat';
import { View } from 'react-native';
import { ChatActionType, ChatContext, IMessage } from '../chatReducer';
import FullPageSpinner from '../../common/FullPageSpinner';
import useAsyncEffect from 'use-async-effect';
import authFetch from '../../util/authFetch';
import { v4 } from 'uuid';
import { AuthContext } from '../../auth/authReducer';
import getParticipantForMessageSender from '../common/getParticipantForMessageSender';
import { IChat } from '../chatReducer';
import BigButton from '../../common/BigButton';
import ChatAvatar from './ChatAvatar';
import { SocketContext } from '../ChatSocketHandler';
import MessageText from './chatElements/MessageText';
import CustomInputToolbar from './chatElements/CustomInputToolbar';
import IAugmentedGiftedChatMessage from './IAugmentedGiftedChatMessage';
import CustomBubble from './chatElements/CustomBubble';

const ChatComponent: FunctionComponent<{
  chatUri: string;
}> = ({ chatUri }) => {
  const { dividerColor } = getThemeVars();

  const [chatState, chatDispatch] = useContext(ChatContext);
  const chatData = chatState.chats[chatUri];

  const [authState] = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isLoadingJoinChat, setIsLoadingJoinChat] = useState(false);
  const [isInitialFetching, setIsInitialFetching] = useState(false);
  const [currentPublicChatUri, setCurrentPublicChatUri] = useState<
    string | undefined
  >(undefined);

  const isCurrentUserParticipant = useMemo(
    (): boolean =>
      !!chatData.chat?.participants.some(
        (p) => p.webId === authState.profile?.webId,
      ),
    [chatData, authState.profile?.webId],
  );

  useAsyncEffect(async () => {
    // Setup subscription is this is a public chat
    if (
      currentPublicChatUri &&
      (currentPublicChatUri !== chatUri || isCurrentUserParticipant) &&
      socket
    ) {
      console.info('unsubscribe', currentPublicChatUri);
      setCurrentPublicChatUri(undefined);
      socket.emit('unsubscribeFromPublicChat', { uri: currentPublicChatUri });
    }
    if (
      currentPublicChatUri !== chatUri &&
      socket &&
      chatData.chat?.isPublic &&
      !isCurrentUserParticipant
    ) {
      console.info('subscribe', chatUri);
      setCurrentPublicChatUri(chatUri);
      socket.emit('subscribeToPublicChat', { uri: chatUri });
    }

    // Fetch Messages
    if (
      !chatState.performedActions[`initialChatMessageFetch:${chatUri}`] &&
      !isInitialFetching
    ) {
      setIsInitialFetching(true);
      setIsLoadingEarlier(true);
      const result = await authFetch(
        `/message/${encodeURIComponent(chatUri)}`,
        undefined,
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody = await result.json();
        chatDispatch({
          type: ChatActionType.ADD_MESSAGE,
          chatId: chatUri,
          message: resultBody as IMessage[],
          performedAction: `initialChatMessageFetch:${chatUri}`,
        });
      } else {
        chatDispatch({
          type: ChatActionType.ADD_MESSAGE,
          chatId: chatUri,
          message: [],
          performedAction: `initialChatMessageFetch:${chatUri}`,
        });
      }
      setIsLoadingEarlier(false);
      setIsInitialFetching(false);
    }
  });

  const onJoinChat = useCallback(async (): Promise<void> => {
    setIsLoadingJoinChat(true);
    await authFetch(
      `/chat/${encodeURIComponent(chatUri)}/authenticated`,
      {
        method: 'put',
      },
      { expectedStatus: 200 },
    );
    setIsLoadingJoinChat(false);
  }, [chatUri]);

  const loggedInUser = authState.profile?.webId || 'public';

  const onLoadEarlier = async () => {
    if (chatData && chatData.messages) {
      setIsLoadingEarlier(true);
      const previousPage = chatData.messages[chatData.messages.length - 1]
        ? chatData.messages[chatData.messages.length - 1].page
        : undefined;
      const result = await authFetch(
        `/message/${encodeURIComponent(chatUri)}${
          previousPage
            ? `?previous_page_id=${encodeURIComponent(previousPage)}`
            : ''
        }`,
        undefined,
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody = await result.json();
        chatDispatch({
          type: ChatActionType.ADD_MESSAGE,
          chatId: chatUri,
          message: resultBody as IMessage[],
          allMessagesLoaded: (resultBody as IMessage[]).length === 0,
        });
      }
      setIsLoadingEarlier(false);
    }
  };

  if (!chatData || !chatData.chat) {
    return <FullPageSpinner />;
  }

  const giftedChatMessages: IAugmentedGiftedChatMessage[] = chatData.messages.map(
    (message): IAugmentedGiftedChatMessage => {
      const participant = getParticipantForMessageSender(
        message,
        chatData.chat as IChat,
      );
      return {
        _id: message.id,
        text: message.content.text?.join(' ') || '',
        image: message.content.image ? message.content.image[0] : undefined,
        file: message.content.file ? message.content.file[0] : undefined,
        video: message.content.video ? message.content.video[0] : undefined,
        createdAt: new Date(message.timeCreated),
        isInvalid: message.isInvalid,
        user: {
          _id: message.maker,
          name: participant.name,
          avatar: participant.image || 'default',
        },
      };
    },
  );

  if (chatData.allMessagesLoaded) {
    giftedChatMessages.push({
      _id: 'beginningMessage',
      text: 'Beginning of the Chat',
      system: true,
      createdAt: giftedChatMessages[giftedChatMessages.length - 1].createdAt,
      user: { _id: 'system' },
    });
  }

  async function handleOnSend(
    newGiftedChatMessages: IAugmentedGiftedChatMessage[],
  ) {
    const messages = newGiftedChatMessages.map((newGiftedChatMessage) => ({
      id: v4(),
      page:
        chatData?.messages[0] && chatData.messages[0].page
          ? chatData.messages[0].page
          : '',
      maker: loggedInUser,
      content: {
        text: newGiftedChatMessage.text
          ? [newGiftedChatMessage.text]
          : undefined,
        image: newGiftedChatMessage.image
          ? [newGiftedChatMessage.image]
          : undefined,
        file: newGiftedChatMessage.file
          ? [newGiftedChatMessage.file]
          : undefined,
        video: newGiftedChatMessage.video
          ? [newGiftedChatMessage.video]
          : undefined,
      },
      timeCreated: new Date(newGiftedChatMessage.createdAt).toISOString(),
    }));
    chatDispatch({
      type: ChatActionType.ADD_MESSAGE,
      chatId: chatUri,
      message: messages,
    });
    // Don't await this because it will mess up the auto refocus
    await Promise.all(
      messages.map(async (message) => {
        const result = await authFetch(
          `/message/${encodeURIComponent(chatUri)}`,
          {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
              'content-type': 'application/json',
            },
          },
          {
            expectedStatus: 201,
          },
        );
        if (result.status === 201) {
          const resultBody = await result.json();
          chatDispatch({
            type: ChatActionType.ADD_MESSAGE,
            chatId: chatUri,
            message: resultBody,
          });
        }
      }),
    );
  }

  return (
    <GiftedChat
      messages={giftedChatMessages}
      onSend={handleOnSend}
      user={{
        _id: loggedInUser,
      }}
      isLoadingEarlier={isLoadingEarlier}
      inverted={true}
      loadEarlier={!chatData.allMessagesLoaded}
      infiniteScroll={true}
      onLoadEarlier={onLoadEarlier}
      renderMessageText={(props) => (
        <MessageText
          text={props.currentMessage?.text}
          isSelf={props.position === 'right'}
        />
      )}
      renderBubble={(props) => <CustomBubble {...props} />}
      renderInputToolbar={(props) => {
        if (!isCurrentUserParticipant) {
          return (
            <View
              style={{
                borderTopColor: dividerColor,
                flex: 1,
                borderTopWidth: 1,
                paddingHorizontal: 8,
                justifyContent: 'center',
              }}
            >
              {authState.profile ? (
                <BigButton
                  title="Join Chat"
                  onPress={onJoinChat}
                  loading={isLoadingJoinChat}
                />
              ) : (
                <Text>Log in to join this chat.</Text>
              )}
            </View>
          );
        }
        return <CustomInputToolbar {...props} chatUri={chatUri} />;
      }}
      renderAvatar={(props) => {
        return <ChatAvatar {...props} />;
      }}
      alwaysShowSend={true}
    />
  );
};

export default ChatComponent;
