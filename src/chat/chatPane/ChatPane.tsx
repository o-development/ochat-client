import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import {
  Layout,
  TopNavigation,
  Divider,
  TopNavigationAction,
  Icon,
  Text,
} from '@ui-kitten/components';
import BigButton from '../../common/BigButton';
import { useHistory } from '../../router';
import getThemeVars from '../../common/getThemeVars';
import {
  GiftedChat,
  IMessage as IGiftedChatMessage,
  Bubble,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import { Dimensions, ViewStyle } from 'react-native';
import dayjs from 'dayjs';
import NewChatPane from '../newChatPane/NewChatPane';
import { ChatActionType, ChatContext, IMessage } from '../chatReducer';
import FullPageSpinner from '../../common/FullPageSpinner';
import useAsyncEffect from 'use-async-effect';
import authFetch from '../../util/authFetch';
import { v4 } from 'uuid';
import { AuthContext } from '../../auth/authReducer';

const ChatPane: FunctionComponent<{
  chatUri: string;
  mobileRender?: boolean;
}> = ({ chatUri, mobileRender }) => {
  const history = useHistory();
  const {
    themeColor,
    backgroundColor4,
    dividerColor,
    backgroundColor1,
    basicTextColor,
  } = getThemeVars();

  const [isEditing, setIsEditing] = useState(false);

  const [chatState, chatDispatch] = useContext(ChatContext);
  const chatData = chatState.chats[chatUri];

  const [authState] = useContext(AuthContext);

  const shouldSquishBubbles = Dimensions.get('window').width < 700;

  useAsyncEffect(async () => {
    await Promise.all([
      (async () => {
        // Fetch Chat
        if (!chatData) {
          const result = await authFetch(
            `/chat/${encodeURIComponent(chatUri)}`,
            undefined,
            {
              expectedStatus: 200,
            },
          );
          if (result.status === 200) {
            const resultBody = await result.json();
            chatDispatch({
              type: ChatActionType.UPDATE_CHAT,
              chats: [resultBody],
            });
          }
        }
      })(),
      (async () => {
        // Fetch Messages
        if (!chatState.performedActions[`initialChatMessageFetch:${chatUri}`]) {
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
          }
        }
      })(),
    ]);
  });

  if (!authState.profile) {
    return <FullPageSpinner />;
  }
  const loggedInUser = authState.profile.webId;

  const onLoadEarlier = async () => {
    if (chatData) {
      const previousPage = chatData.messages[chatData.messages.length - 1].page;
      const result = await authFetch(
        `/message/${encodeURIComponent(
          chatUri,
        )}?previous_page_id=${encodeURIComponent(previousPage)}`,
        undefined,
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody = await result.json();
        chatDispatch({
          type: ChatActionType.ADD_MESSAGE,
          chatId: chatUri,
          message: resultBody as IMessage[],
        });
      }
    }
  };

  if (!chatData || !chatData.chat) {
    return <FullPageSpinner />;
  }

  if (isEditing) {
    return (
      <NewChatPane
        onChatModificationClosed={() => setIsEditing(false)}
        mobileRender={mobileRender}
        modifyingChat={chatData.chat}
      />
    );
  }

  const giftedChatMessages: IGiftedChatMessage[] = chatData.messages.map(
    (message): IGiftedChatMessage => ({
      _id: message.id,
      text: message.content,
      createdAt: new Date(message.timeCreated),
      user: {
        _id: message.maker,
      },
    }),
  );

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
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title={chatData.chat.name}
        accessoryRight={() => (
          <BigButton
            title="Chat Settings"
            appearance="ghost"
            onPress={() => setIsEditing(true)}
          />
        )}
        accessoryLeft={
          mobileRender
            ? () => (
                <TopNavigationAction
                  onPress={() => history.push('/chat')}
                  icon={(props) => (
                    <Icon {...props} name="people-outline" fill={themeColor} />
                  )}
                />
              )
            : undefined
        }
      />
      <Divider />
      <GiftedChat
        messages={giftedChatMessages}
        onSend={handleOnSend}
        user={{
          _id: loggedInUser,
        }}
        inverted={true}
        loadEarlier={true}
        infiniteScroll={true}
        onLoadEarlier={onLoadEarlier}
        renderMessageText={(props) => <Text>{props.currentMessage?.text}</Text>}
        renderTime={({ currentMessage, timeFormat }) => {
          return (
            <Text category="c1">
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
            marginVertical: 4,
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
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={[props.textInputStyle, { color: basicTextColor }]}
          />
        )}
      />
    </Layout>
  );
};

export default ChatPane;
