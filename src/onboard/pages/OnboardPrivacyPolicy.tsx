import React, { FunctionComponent } from 'react';
import BigButton from '../../common/BigButton';
import OnboardPageLayout from '../OnboardPageLayout';
import PrivacyPolicyContent from '../../privacyPolicy/PrivacyPolicyContent';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import getThemeVars from '../../common/getThemeVars';
import { Text } from '@ui-kitten/components';

interface OnboardPrivacyPolicyProps {
  onComplete: () => void;
}

const OnboardPrivacyPolicy: FunctionComponent<OnboardPrivacyPolicyProps> = ({
  onComplete,
}) => {
  const { dividerColor } = getThemeVars();
  return (
    <OnboardPageLayout
      title="Agree to the Privacy Policy"
      middleContent={
        <View style={{ flex: 1 }}>
          <Text>
            You can read the privacy policy at any time by going to the Settings
            menu.
          </Text>
          <ScrollView
            style={{
              height: 300,
              padding: 16,
              borderColor: dividerColor,
              borderWidth: 1,
              marginBottom: 8,
            }}
          >
            <PrivacyPolicyContent />
          </ScrollView>
          <BigButton
            title="Agree and Continue"
            containerStyle={{ marginBottom: 8 }}
            onPress={() => onComplete()}
          />
        </View>
      }
    />
  );
};

export default OnboardPrivacyPolicy;
