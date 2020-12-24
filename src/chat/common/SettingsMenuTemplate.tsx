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
import { ScrollView, View } from 'react-native';

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
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title={title}
        accessoryRight={
          closeButton
            ? () => (
                <TopNavigationAction
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
          flex: 1,
          alignItems: 'center',
        }}
      >
        <View style={{ maxWidth: 500, width: '100%' }}>{children}</View>
      </ScrollView>
    </Layout>
  );
};

export default SettingsMenuTemplate;
