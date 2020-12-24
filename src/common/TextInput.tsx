import React from 'react';
import { FunctionComponent } from 'react';
import { InputProps, Input } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { themeColor } from './const';

const TextInput: FunctionComponent<InputProps> = (props) => {
  return (
    <Input
      {...props}
      style={StyleSheet.flatten([
        {
          borderColor: themeColor,
          backgroundColor: 'transparent',
          marginBottom: 8,
          padding: 0,
        },
        props.style,
      ])}
    />
  );
};

export default TextInput;
