import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, View } from 'react-native';
import { FunctionComponent } from 'react';
import { Spinner, Text } from '@ui-kitten/components';
import { themeColor } from './const';

interface Props {
  appearance?: 'primary' | 'ghost' | 'secondary';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  title?: string;
  size?: 'big' | 'small' | 'medium';
  onPress?: () => void;
  loading?: boolean;
}

const BigButton: FunctionComponent<Props> = ({
  appearance = 'secondary',
  containerStyle = {},
  textStyle = {},
  size = 'medium',
  title = 'Submit',
  onPress = () => {
    /* Do nothing */
  },
  loading,
}) => {
  let marginSize;
  let spinnerSize;
  switch (size) {
    case 'big':
      marginSize = 16;
      spinnerSize = 'medium';
      break;
    case 'medium':
      marginSize = 8;
      spinnerSize = 'small';
      break;
    case 'small':
      marginSize = 4;
      spinnerSize = 'tiny';
      break;
  }
  const usedContainerStyle: ViewStyle = {
    backgroundColor: appearance === 'primary' ? themeColor : 'transparent',
    borderColor: themeColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: appearance !== 'ghost' ? 1 : 0,
    ...containerStyle,
  };
  const usedTextStyle: TextStyle = {
    textAlign: 'center',
    color: appearance === 'primary' ? 'white' : themeColor,
    margin: marginSize,
    ...textStyle,
  };
  return (
    <TouchableOpacity
      onPress={() => {
        if (!loading) onPress();
      }}
    >
      <View style={usedContainerStyle}>
        {loading ? (
          <View style={{ margin: marginSize }}>
            <Spinner size={spinnerSize} status="control" />
          </View>
        ) : (
          <Text style={usedTextStyle}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BigButton;
