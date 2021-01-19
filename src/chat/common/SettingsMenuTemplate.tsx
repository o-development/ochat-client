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
                <TopNavigationAction
                  style={{
                    height: 40,
                    width: 32,
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => onCloseButton()}
                  icon={(props) => (
                    <Icon {...props} name="close-outline" fill={themeColor} />
                  )}
                />
              )
            : undefined
        }
        accessoryLeft={
          mobileRender && backButton
            ? () => (
                <TopNavigationAction
                  style={{
                    height: 40,
                    width: 32,
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => history.push('/chat')}
                  icon={(props) => (
                    <Icon
                      {...props}
                      name="arrow-back-outline"
                      fill={themeColor}
                    />
                  )}
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
