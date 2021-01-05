import React, { PropsWithChildren, ReactElement, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Divider, Icon, Input, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import getThemeVars from './getThemeVars';

export default function ChipInput<T>(
  props: PropsWithChildren<{
    value?: T[];
    search?: (searchTerm: string) => Promise<T[]>;
    onAdded?: (item: T) => void;
    onRemoved?: (item: T) => void;
    renderSearchResult: (item: T, onAdd: () => void) => ReactElement;
    renderChip: (item: T, onRemove: () => void) => ReactElement;
    label?: string;
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
  }>,
): ReactElement {
  const {
    label,
    value,
    search,
    renderSearchResult,
    renderChip,
    style,
    onAdded,
    onRemoved,
    placeholder,
  } = props;
  const { themeColor, backgroundColor1 } = getThemeVars();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<T[]>([]);
  return (
    <View
      style={StyleSheet.flatten([
        {
          marginBottom: 8,
        },
        style,
      ])}
    >
      {label ? (
        <Text appearance="hint" category="label" style={{ marginBottom: 4 }}>
          {label}
        </Text>
      ) : undefined}
      <View
        style={{
          borderColor: themeColor,
          borderRadius: 4,
          borderWidth: 1,
          paddingVertical: 7,
          paddingHorizontal: 8,
          zIndex: 1,
        }}
      >
        {searchResults.length > 0 ? (
          <View
            style={{
              position: 'absolute',
              bottom: '100%',
              width: '100%',
              borderColor: themeColor,
              borderRadius: 4,
              borderWidth: 1,
              margin: -1,
              paddingHorizontal: 8,
              backgroundColor: backgroundColor1,
              zIndex: 10,
              elevation: 10,
            }}
          >
            {searchResults.map((item, index) => (
              <>
                {index !== 0 ? <Divider key={index} /> : undefined}
                {renderSearchResult(item, () => {
                  setSearchTerm('');
                  setSearchResults([]);
                  if (onAdded) {
                    onAdded(item);
                  }
                })}
              </>
            ))}
            <Divider />
          </View>
        ) : undefined}
        <View>
          <Input
            placeholder={placeholder}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              marginHorizontal: -8,
            }}
            value={searchTerm}
            accessoryLeft={(props) => <Icon {...props} name="search-outline" />}
            onChangeText={async (text) => {
              setSearchTerm(text);
              if (search) {
                setSearchResults(await search(text));
              }
            }}
          />
        </View>
        {value && value.length > 0 ? (
          <>
            <Divider />
            {value.map((item, index) => (
              <>
                {index !== 0 ? <Divider key={index} /> : undefined}
                {renderChip(item, () => {
                  if (onRemoved) {
                    onRemoved(item);
                  }
                })}
              </>
            ))}
          </>
        ) : undefined}
      </View>
    </View>
  );
}
