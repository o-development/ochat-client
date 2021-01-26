import React, { useCallback, useContext, useMemo, useState } from 'react';
import { FunctionComponent } from 'react';
import { Icon, Text } from '@ui-kitten/components';
import getThemeVars from '../../common/getThemeVars';
import {
  GiftedChat,
  IMessage as IGiftedChatMessage,
  Bubble,
  InputToolbar,
  Composer,
  SendProps,
  Send,
  Avatar,
} from 'react-native-gifted-chat';
import { useWindowDimensions, View, ViewStyle } from 'react-native';
import dayjs from 'dayjs';
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

const ChatComponent: FunctionComponent<{
  chatUri: string;
}> = ({ chatUri }) => {
  const {
    themeColor,
    backgroundColor4,
    dividerColor,
    backgroundColor1,
    basicTextColor,
  } = getThemeVars();

  const [chatState, chatDispatch] = useContext(ChatContext);
  const chatData = chatState.chats[chatUri];

  const [authState] = useContext(AuthContext);

  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isLoadingJoinChat, setIsLoadingJoinChat] = useState(false);

  const shouldSquishBubbles = useWindowDimensions().width < 700;

  useAsyncEffect(async () => {
    await Promise.all([
      (async () => {
        // Fetch Messages
        if (!chatState.performedActions[`initialChatMessageFetch:${chatUri}`]) {
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
        }
      })(),
    ]);
  });

  const isCurrentUserParticipant = useMemo(
    (): boolean =>
      !!chatData.chat?.participants.some(
        (p) => p.webId === authState.profile?.webId,
      ),
    [chatData, authState.profile?.webId],
  );

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

  const giftedChatMessages: IGiftedChatMessage[] = chatData.messages.map(
    (message): IGiftedChatMessage => {
      const participant = getParticipantForMessageSender(
        message,
        chatData.chat as IChat,
      );
      return {
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.timeCreated),
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

  async function handleOnSend(newGiftedChatMessages: IGiftedChatMessage[]) {
    const messages = newGiftedChatMessages.map((newGiftedChatMessage) => ({
      id: v4(),
      page:
        chatData?.messages[0] && chatData.messages[0].page
          ? chatData.messages[0].page
          : '',
      maker: loggedInUser,
      content: newGiftedChatMessage.text,
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
        <Text style={{ color: props.position === 'left' ? '#000' : '#FFF' }}>
          {props.currentMessage?.text}
        </Text>
      )}
      renderTime={({ currentMessage, timeFormat, position }) => {
        return (
          <Text
            category="c1"
            style={{ color: position === 'left' ? '#000' : '#FFF' }}
          >
            {dayjs(currentMessage?.createdAt).locale('en').format(timeFormat)}
          </Text>
        );
      }}
      renderBubble={(props) => {
        const commonWrapperStyle: ViewStyle = {
          padding: 10,
          maxWidth: shouldSquishBubbles ? undefined : '55%',
        };
        const commonContainerStyle: ViewStyle = {
          marginVertical: 1,
        };
        return (
          <Bubble
            {...props}
            containerStyle={{
              left: commonContainerStyle,
              right: commonContainerStyle,
            }}
            wrapperStyle={{
              left: {
                backgroundColor: backgroundColor4,
                ...commonWrapperStyle,
              },
              right: { backgroundColor: themeColor, ...commonWrapperStyle },
            }}
          />
        );
      }}
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
        return (
          <InputToolbar
            {...props}
            containerStyle={[
              props.containerStyle,
              {
                borderTopColor: dividerColor,
                backgroundColor: backgroundColor1,
              },
            ]}
          />
        );
      }}
      renderAvatar={(props) => {
        return <ChatAvatar {...props} />;
      }}
      renderComposer={(props) => (
        <Composer
          {...props}
          textInputProps={{
            returnKeyType: 'next',
            onSubmitEditing: () => {
              const { onSend, text } = props as SendProps<IGiftedChatMessage>;
              if (text && onSend) {
                onSend({ text: text.trim() }, true);
              }
            },
            blurOnSubmit: false,
          }}
          multiline={false}
          textInputStyle={[
            props.textInputStyle,
            {
              color: basicTextColor,
              marginVertical: 4,
              paddingVertical: 4,
            },
          ]}
        />
      )}
      renderSend={(props) => {
        return (
          <Send
            {...props}
            containerStyle={{ padding: 4, justifyContent: 'center' }}
          >
            <Icon
              style={{ width: 32, height: 32 }}
              name="arrow-circle-right"
              fill={themeColor}
            />
          </Send>
        );
      }}
    />
  );
};

export default ChatComponent;
