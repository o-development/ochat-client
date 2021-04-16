import React from 'react';
import { FunctionComponent } from 'react';
import {
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Divider,
} from '@ui-kitten/components';
import { useHistory } from '../../router';
import getThemeVars from '../../common/getThemeVars';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import IconButton from '../../common/IconButton';

const SettingsMenuTemplate: FunctionComponent<{
  title: string;
  mobileRender?: boolean;
  backButton?: boolean;
  closeButton?: boolean;
  onCloseButton?: () => void;
}> = ({
  title,
  mobileRender,
  backButton = true,
  closeButton,
  onCloseButton = () => {
    /* nothing */
  },
  children,
}) => {
  const { themeColor } = getThemeVars();
  const history = useHistory();

  return (
    <Layout style={{ flex: 1, zIndex: 1 }}>
      <TopNavigation
        alignment="center"
        title={title}
        accessoryRight={
          closeButton
            ? () => (
                <IconButton
                  onPress={() => onCloseButton()}
                  iconName="close-outline"
                />
              )
            : undefined
        }
        accessoryLeft={
          mobileRender && backButton
            ? () => (
                <IconButton
                  iconName="arrow-back-outline"
                  onPress={() => history.push('/chat')}
                />
              )
            : undefined
        }
      />
      <Divider />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          alignItems: 'center',
        }}
      >
        <KeyboardAvoidingView
          style={{ maxWidth: 500, width: '100%', zIndex: 1 }}
        >
          {children}
        </KeyboardAvoidingView>
      </ScrollView>
    </Layout>
  );
};

export default SettingsMenuTemplate;
