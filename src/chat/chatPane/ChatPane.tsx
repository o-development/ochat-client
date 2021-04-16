import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import { Layout, TopNavigation, Divider, Text } from '@ui-kitten/components';
import { useHistory } from '../../router';
import getThemeVars from '../../common/getThemeVars';
import { ChatActionType, ChatContext } from '../chatReducer';
import FullPageSpinner from '../../common/FullPageSpinner';
import ChatSettingsPane from '../chatSettings/ChatSettingsPane';
import ChatComponent from './ChatComponent';
import { useWindowDimensions, View } from 'react-native';
import ChatDetails from '../chatSettings/ChatDetails';
import { ScrollView } from 'react-native-gesture-handler';
import authFetch from '../../util/authFetch';
import useAsyncEffect from 'use-async-effect';
import { AuthContext } from '../../auth/authReducer';
import BigButton from '../../common/BigButton';
import LoginSolid from '../../home/LoginSolid';
import IconButton from '../../common/IconButton';

const ChatPane: FunctionComponent<{
  chatUri: string;
  mobileRender?: boolean;
}> = ({ chatUri, mobileRender }) => {
  const history = useHistory();
  const { dividerColor } = getThemeVars();

  const [isEditing, setIsEditing] = useState(false);

  const [chatState, chatDispatch] = useContext(ChatContext);
  const [authState] = useContext(AuthContext);
  const [isInitialFetching, setIsInitialFetching] = useState(false);
  const chatData = chatState.chats[chatUri];

  const isWide = useWindowDimensions().width > 1000;

  const performInitialChatFetch = async (
    chatUri: string,
    actionName: string,
  ) => {
    if (isInitialFetching) {
      return;
    }
    setIsInitialFetching(true);
    const result = await authFetch(
      `/chat/${encodeURIComponent(chatUri)}`,
      undefined,
      {
        expectedStatus: 200,
        errorHandlers: {
          '401': async (): Promise<void> => {
            /* Do nothing */
          },
        },
      },
    );
    if (result.status === 200) {
      const resultBody = await result.json();
      chatDispatch({
        type: ChatActionType.UPDATE_CHAT,
        chats: [resultBody],
        performedAction: actionName,
      });
    } else {
      chatDispatch({
        type: ChatActionType.UPDATE_CHAT,
        chats: [],
        performedAction: actionName,
      });
    }
    setIsInitialFetching(false);
  };

  useAsyncEffect(async () => {
    // Fetch Chat
    if (authState.isLoading) {
      return;
    }
    if (!chatData) {
      if (
        !authState.profile &&
        !chatState.performedActions[
          `initialChatFetch:unauthenticated:${chatUri}`
        ]
      ) {
        await performInitialChatFetch(
          chatUri,
          `initialChatFetch:unauthenticated:${chatUri}`,
        );
      } else if (
        authState.profile &&
        !chatState.performedActions[`initialChatFetch:authenticated:${chatUri}`]
      ) {
        await performInitialChatFetch(
          chatUri,
          `initialChatFetch:authenticated:${chatUri}`,
        );
      }
    }
  });

  if (!chatData || !chatData.chat) {
    if (
      !authState.profile &&
      chatState.performedActions[`initialChatFetch:unauthenticated:${chatUri}`]
    ) {
      // If the user is not logged in and they do not have access to the chat
      return (
        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
        >
          <Text category="h2">
            You do not have access to this chat. Log In to get access.
          </Text>
          {mobileRender ? (
            <LoginSolid
              redirectAfterLogin={`${window.location.pathname}${window.location.search}`}
            />
          ) : undefined}
        </Layout>
      );
    } else if (
      authState.profile &&
      chatState.performedActions[`initialChatFetch:authenticated:${chatUri}`]
    ) {
      // If the user is logged in and they do have access to the chat
      return (
        <Layout
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
        >
          <Text category="h2">You do not have access to this chat.</Text>
          {mobileRender ? (
            <BigButton
              title="Back Home"
              onPress={() => history.push('/chat')}
            />
          ) : undefined}
        </Layout>
      );
    } else {
      // Fetches are loading
      return <FullPageSpinner />;
    }
  }

  if (isEditing) {
    return (
      <ChatSettingsPane
        onChatModificationClosed={() => setIsEditing(false)}
        mobileRender={mobileRender}
        modifyingChat={chatData.chat}
      />
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title={chatData.chat.name}
        accessoryRight={() => (
          <IconButton
            iconName="settings-2-outline"
            onPress={() => setIsEditing(true)}
          />
        )}
        accessoryLeft={
          mobileRender
            ? () => (
                <IconButton
                  iconName="people-outline"
                  onPress={() => history.push('/chat')}
                />
              )
            : undefined
        }
      />
      <Divider />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ChatComponent chatUri={chatUri} />
        {isWide ? (
          <ScrollView
            style={{
              maxWidth: 300,
              padding: 12,
              borderLeftColor: dividerColor,
              borderLeftWidth: 1,
            }}
          >
            <ChatDetails chat={chatData.chat} />
          </ScrollView>
        ) : undefined}
      </View>
    </Layout>
  );
};

export default ChatPane;
