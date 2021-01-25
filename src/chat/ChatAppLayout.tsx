import React, {
  FunctionComponent,
  ReactElement,
  useContext,
  useEffect,
} from 'react';
import { useHistory, useLocation } from '../router';
import { useWindowDimensions, View } from 'react-native';
import ChatPane from './chatPane/ChatPane';
import ChatSelectionPane from './chatSelectionPane/ChatSelectionPane';
import NoChatSelectedPane from './chatSelectionPane/NoChatSelectedPane';
import queryString from 'query-string';
import NewChatPane from './chatSettings/NewChatPane';
import Settings from './settings/Settings';
import LinkChatPane from './chatSettings/LinkChatPane';
import { AuthContext } from '../auth/authReducer';
import FullPageSpinner from '../common/FullPageSpinner';
import OnboardFlow from '../onboard/OnboardFlow';

const ChatAppLayout: FunctionComponent = () => {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const queryId = queryString.parse(search).id;
  const id = Array.isArray(queryId) ? queryId[0] : queryId || undefined;
  const isMobile = useWindowDimensions().width < 500;

  const [authState] = useContext(AuthContext);

  useEffect(() => {
    if (!authState.profile && !id) {
      history.push('/');
    }
  });

  if (authState.isLoading) {
    return <FullPageSpinner />;
  }

  if (authState.requiresOnboarding) {
    return <OnboardFlow />;
  }

  let mainComponent: ReactElement;
  if (pathname === '/chat/new') {
    mainComponent = <NewChatPane mobileRender={isMobile} />;
  } else if (pathname === '/chat/link') {
    mainComponent = <LinkChatPane mobileRender={isMobile} />;
  } else if (pathname === '/chat/settings') {
    mainComponent = <Settings mobileRender={isMobile} />;
  } else if (id) {
    mainComponent = <ChatPane chatUri={id} mobileRender={isMobile} />;
  } else {
    mainComponent = isMobile ? (
      <ChatSelectionPane currentlySelected={id} mobileRender={isMobile} />
    ) : (
      <NoChatSelectedPane />
    );
  }

  // On a mobile device
  if (isMobile) {
    return mainComponent;
  }

  // On a browser or tablet
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        height: '100%',
      }}
    >
      <View style={{ flex: 1, maxWidth: 500, minWidth: 250 }}>
        <ChatSelectionPane currentlySelected={id} />
      </View>
      <View style={{ flex: 3 }}>{mainComponent}</View>
    </View>
  );
};

export default ChatAppLayout;
