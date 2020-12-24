import React, { PropsWithChildren, ReactElement, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Divider, Icon, Input, List, Text } from '@ui-kitten/components';
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
  const { themeColor } = getThemeVars();
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
        }}
      >
        {value && value.length > 0 ? (
          <>
            <List<T>
              data={value}
              renderItem={({ item }) =>
                renderChip(item, () => {
                  if (onRemoved) {
                    onRemoved(item);
                  }
                })
              }
              ItemSeparatorComponent={Divider}
            />
            <Divider />
          </>
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
          {searchResults.length > 0 ? (
            <>
              <Divider />
              <List<T>
                data={searchResults}
                renderItem={({ item }) =>
                  renderSearchResult(item, () => {
                    setSearchTerm('');
                    setSearchResults([]);
                    if (onAdded) {
                      onAdded(item);
                    }
                  })
                }
                ItemSeparatorComponent={Divider}
              />
            </>
          ) : undefined}
        </View>
      </View>
    </View>
  );
}
