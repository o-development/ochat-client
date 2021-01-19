import React, { useContext, useState } from 'react';
import { FunctionComponent } from 'react';
import {
  Layout,
  TopNavigation,
  Divider,
  TopNavigationAction,
  Icon,
} from '@ui-kitten/components';
import { useHistory } from '../../router';
import getThemeVars from '../../common/getThemeVars';
import { ChatContext } from '../chatReducer';
import FullPageSpinner from '../../common/FullPageSpinner';
import ChatSettingsPane from '../chatSettings/ChatSettingsPane';
import ChatComponent from './ChatComponent';
import { useWindowDimensions, View } from 'react-native';
import ChatDetails from '../chatSettings/ChatDetails';
import { ScrollView } from 'react-native-gesture-handler';

const ChatPane: FunctionComponent<{
  chatUri: string;
  mobileRender?: boolean;
}> = ({ chatUri, mobileRender }) => {
  const history = useHistory();
  const { themeColor, dividerColor } = getThemeVars();

  const [isEditing, setIsEditing] = useState(false);

  const [chatState] = useContext(ChatContext);
  const chatData = chatState.chats[chatUri];

  const isWide = useWindowDimensions().width > 1000;

  if (!chatData || !chatData.chat) {
    return <FullPageSpinner />;
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
          <TopNavigationAction
            onPress={() => setIsEditing(true)}
            icon={(props) => (
              <Icon {...props} name="settings-2-outline" fill={themeColor} />
            )}
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
