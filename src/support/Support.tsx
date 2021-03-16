import { Text } from '@ui-kitten/components';
import React from 'react';
import { FunctionComponent } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import SettingsMenuTemplate from '../chat/common/SettingsMenuTemplate';

const Support: FunctionComponent = () => {
  return (
    <SettingsMenuTemplate
      title="Liqid Chat Support"
      backButton={true}
      mobileRender={true}
    >
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text>For questions email Jackson Morgan at jackson@o.team</Text>
      </ScrollView>
    </SettingsMenuTemplate>
  );
};

export default Support;
