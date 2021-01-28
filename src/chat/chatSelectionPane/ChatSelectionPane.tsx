import React, { useContext } from 'react';
import { FunctionComponent } from 'react';
import { Layout } from '@ui-kitten/components';
import getThemeVars from '../../common/getThemeVars';
import { AuthContext } from '../../auth/authReducer';
import ChatSelection from './ChatSelection';
import LoginSolid from '../../home/LoginSolid';

const ChatSelectionPane: FunctionComponent<{
  mobileRender?: boolean;
  currentlySelected?: string;
}> = ({ mobileRender, currentlySelected }) => {
  const { dividerColor } = getThemeVars();
  const [authState] = useContext(AuthContext);

  return (
    <Layout
      style={{
        borderRightColor: dividerColor,
        borderRightWidth: mobileRender ? 0 : 1,
        height: '100%',
      }}
    >
      {authState.profile ? (
        <ChatSelection currentlySelected={currentlySelected} />
      ) : (
        <LoginSolid />
      )}
    </Layout>
  );
};

export default ChatSelectionPane;
