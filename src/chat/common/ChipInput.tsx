import React from 'react';
import { PropsWithChildren, ReactElement } from 'react';
import {
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  TextInput,
  TextInputProps,
} from 'react-native';

export default function ChipInput<T>(
  props: PropsWithChildren<{
    chipValues?: T[];
    renderChip: (props: {
      style?: StyleProp<ViewStyle>;
      value: T;
    }) => ReactElement;
    style?: StyleProp<ViewStyle>;
    textInputProps: TextInputProps;
  }>,
): ReactElement {
  const { chipValues, style, renderChip, textInputProps } = props;
  return (
    <View
      style={StyleSheet.flatten([
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'stretch',
        },
        style,
      ])}
    >
      {chipValues
        ? chipValues.map((value) => renderChip({ value, style: {} }))
        : undefined}
      <TextInput
        {...textInputProps}
        key="textbox"
        style={StyleSheet.flatten([
          textInputProps.style,
          { marginHorizontal: 8, flexGrow: 1 },
        ])}
      />
    </View>
  );
}
