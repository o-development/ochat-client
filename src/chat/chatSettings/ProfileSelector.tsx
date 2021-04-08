import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Modal,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import debounce from 'debounce-promise';
import { IChatParticipant } from '../chatReducer';
import getThemeVars from '../../common/getThemeVars';
import ChipInput from '../common/ChipInput';
import GroupImage from '../common/GroupImage';
import UserProfileListItem from '../common/UserProfileListItem';
import authFetch from '../../util/authFetch';
import IProfile from '../../auth/authReducer';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import UserProfileActionsMenu from '../common/UserProfileActionsMenu';

interface ProfileSelectorProps {
  value?: IChatParticipant[];
  onAdded?: (item: IChatParticipant) => void;
  onRemoved?: (item: IChatParticipant) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  isAdmin: boolean;
  inModal?: boolean;
}

const ProfileSelectorChip: FunctionComponent<{
  style?: StyleProp<ViewStyle>;
  value: IChatParticipant;
  onRemoved?: (item: IChatParticipant) => void;
}> = ({ style, value, onRemoved }): ReactElement => {
  const { highlightColor, basicTextColor } = getThemeVars();
  return (
    <View
      key={value.webId}
      style={StyleSheet.flatten([
        {
          backgroundColor: highlightColor,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          borderRadius: 24,
          marginRight: 8,
          marginBottom: 8,
        },
        style,
      ])}
    >
      <GroupImage
        images={value.image ? [value.image] : []}
        width={32}
        style={{ marginRight: 8 }}
      />
      <Text>{value.name || value.webId}</Text>
      <UserProfileActionsMenu profile={value} />
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 32 }}
        onPress={() => {
          if (onRemoved) {
            onRemoved(value);
          }
        }}
        accessoryLeft={(props) => (
          <Icon {...props} fill={basicTextColor} name="close-outline" />
        )}
      />
    </View>
  );
};

const ProfileSelectorUi: FunctionComponent<ProfileSelectorProps> = ({
  value,
  isAdmin,
  onRemoved,
  onAdded,
  inModal,
}) => {
  const { highlightColor } = getThemeVars();

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<IChatParticipant[]>([]);
  const [searchResultSelected, setSearchResultSelected] = useState(-1);

  const filteredSearchResults = useMemo(
    () =>
      searchResults.filter((result) =>
        value?.every((participant) => participant.webId !== result.webId),
      ),
    [searchResults, value],
  );

  const onSearchSubmitted = useCallback(
    (result: IChatParticipant) => {
      if (onAdded) {
        setSearchText('');
        setSearchResults([]);
        onAdded(result);
      }
    },
    [onAdded],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const performSearch = useCallback(
    debounce(async (searchTerm: string): Promise<void> => {
      const result = await authFetch(
        `/profile/search?term=${encodeURIComponent(searchTerm)}`,
        { method: 'post' },
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const profiles = (await result.json()) as IProfile[];
        setSearchResults(
          profiles.map((profile) => ({
            webId: profile.webId,
            image: profile.image,
            name: profile.name,
            isAdmin,
          })),
        );
      } else {
        setSearchResults([]);
      }
      setSearchResultSelected(-1);
    }, 1000),
    [setSearchResults, isAdmin],
  );

  const onSearch = useCallback(
    async (searchTerm: string): Promise<void> => {
      setSearchText(searchTerm);
      await performSearch(searchTerm);
    },
    [performSearch, setSearchText],
  );

  const onSearchKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (
        e.nativeEvent.key === 'Backspace' &&
        searchText === '' &&
        value &&
        value.length > 0 &&
        onRemoved
      ) {
        onRemoved(value[value.length - 1]);
      } else if (
        e.nativeEvent.key === 'ArrowDown' &&
        searchResultSelected < filteredSearchResults.length - 1
      ) {
        setSearchResultSelected(searchResultSelected + 1);
      } else if (e.nativeEvent.key === 'ArrowUp' && searchResultSelected > 0) {
        setSearchResultSelected(searchResultSelected - 1);
      } else if (
        e.nativeEvent.key === 'Enter' &&
        filteredSearchResults[searchResultSelected]
      ) {
        onSearchSubmitted(filteredSearchResults[searchResultSelected]);
      }
    },
    [
      searchText,
      onRemoved,
      value,
      searchResultSelected,
      filteredSearchResults,
      onSearchSubmitted,
    ],
  );

  const onSearchBlur = useCallback(() => {
    setSearchResultSelected(-1);
  }, [setSearchResultSelected]);

  return (
    <>
      <ChipInput
        textInputProps={{
          value: searchText,
          onChangeText: onSearch,
          onKeyPress: onSearchKeyPress,
          onBlur: onSearchBlur,
          placeholder: 'Search by name or WebId',
          style: { height: 50, marginBottom: 8 },
          blurOnSubmit: false,
          autoFocus: inModal,
        }}
        chipValues={value}
        renderChip={(props) => (
          <ProfileSelectorChip
            {...props}
            onRemoved={onRemoved}
            key={props.value.webId}
          />
        )}
      />
      {filteredSearchResults.length > 0 ? (
        <View style={{ marginTop: 8 }}>
          <Divider />
          {filteredSearchResults.map((participant, index) => (
            <View key={participant.webId}>
              {index !== 0 ? <Divider /> : undefined}
              <UserProfileListItem
                name={`Add ${participant.name || participant.webId} as ${
                  isAdmin ? `an administrator` : `a participant`
                }`}
                profile={participant}
                image={participant.image}
                style={
                  searchResultSelected === index
                    ? { backgroundColor: highlightColor }
                    : {}
                }
                onPress={() => onSearchSubmitted(participant)}
              />
            </View>
          ))}
        </View>
      ) : undefined}
    </>
  );
};

const ProfileSelector: FunctionComponent<ProfileSelectorProps> = (props) => {
  const { style, label } = props;
  const { themeColor } = getThemeVars();
  const [modalOpen, setModalOpen] = useState(false);
  const { width, height } = Dimensions.get('window');
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
          paddingBottom: 0,
          paddingHorizontal: 8,
          zIndex: 1,
        }}
      >
        {Platform.OS === 'web' ? (
          <ProfileSelectorUi {...props} />
        ) : (
          <>
            <ChipInput
              textInputProps={{
                value: '',
                onFocus: () => setModalOpen(true),
                placeholder: 'Search by name or WebId',
                style: { height: 50, marginBottom: 8 },
                blurOnSubmit: false,
              }}
              chipValues={props.value}
              renderChip={(chipProps) => (
                <ProfileSelectorChip
                  {...chipProps}
                  onRemoved={props.onRemoved}
                />
              )}
            />
            <Modal visible={modalOpen}>
              <Layout
                style={{ width, height, paddingTop: getStatusBarHeight() }}
              >
                <TopNavigation
                  alignment="center"
                  title={props.label}
                  accessoryRight={() => (
                    <TopNavigationAction
                      style={{
                        height: 40,
                        width: 32,
                        margin: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => setModalOpen(false)}
                      icon={(props) => (
                        <Icon
                          {...props}
                          name="close-outline"
                          fill={themeColor}
                        />
                      )}
                    />
                  )}
                />
                <Divider />
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                  enabled
                  keyboardVerticalOffset={10}
                >
                  <ScrollView style={{ padding: 8 }}>
                    <ProfileSelectorUi {...props} inModal={true} />
                  </ScrollView>
                </KeyboardAvoidingView>
              </Layout>
            </Modal>
          </>
        )}
      </View>
    </View>
  );
};

export default ProfileSelector;
