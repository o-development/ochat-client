import { FunctionComponent } from 'react';
import React from 'react';
import { View } from 'react-native';
import { Radio, RadioGroup, Text } from '@ui-kitten/components';

const MuteOptions: FunctionComponent = () => {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Text category="h3" style={{ marginVertical: 16 }}>
        Mute Options
      </Text>
      <RadioGroup>
        <Radio>Mute for 15 minutes</Radio>
        <Radio>Mute for 1 hour</Radio>
        <Radio>Mute for 8 hours</Radio>
        <Radio>Mute for 24 hours</Radio>
        <Radio>Mute until I turn it back on</Radio>
      </RadioGroup>
    </View>
  );
};

export default MuteOptions;
