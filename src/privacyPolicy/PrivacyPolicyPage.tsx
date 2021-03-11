import React from 'react';
import { FunctionComponent } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import SettingsMenuTemplate from '../chat/common/SettingsMenuTemplate';
import PrivacyPolicyContent from './PrivacyPolicyContent';

const PrivacyPolicyPage: FunctionComponent = () => {
  return (
    <SettingsMenuTemplate
      title="Liqid Chat Privacy Policy"
      backButton={true}
      mobileRender={true}
    >
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <PrivacyPolicyContent />
      </ScrollView>
    </SettingsMenuTemplate>
  );
};

export default PrivacyPolicyPage;
