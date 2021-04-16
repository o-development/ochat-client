import React, { memo } from 'react';
import { FunctionComponent } from 'react';
import { List, Divider } from '@ui-kitten/components';
import getThemeVars from '../../common/getThemeVars';
import { IChat } from '../chatReducer';
import IProfile from '../../auth/authReducer';
import { v4 } from 'uuid';
import ChatSelectionItem from './ChatSelectionItem';
import BigButton from '../../common/BigButton';
import { View } from 'react-native';

export interface ChatSelectionListProps {
  chatList: (IChat | IProfile)[];
  onLoadMoreResults: () => void;
  isLoadingMore?: boolean;
  allLoaded?: boolean;
  currentlySelected?: string;
}

// eslint-disable-next-line react/display-name
const ChatSelectionList: FunctionComponent<ChatSelectionListProps> = memo(
  ({
    currentlySelected,
    onLoadMoreResults,
    chatList,
    isLoadingMore,
    allLoaded,
  }) => {
    const { backgroundColor1 } = getThemeVars();

    return (
      <>
        <List<IChat | IProfile>
          data={chatList}
          ItemSeparatorComponent={Divider}
          style={{ backgroundColor: backgroundColor1 }}
          onEndReachedThreshold={0.01}
          onEndReached={onLoadMoreResults}
          keyExtractor={(item: IChat | IProfile): string => {
            if ((item as IChat).uri) {
              return (item as IChat).uri;
            } else if ((item as IProfile).webId) {
              return (item as IProfile).webId;
            }
            return v4();
          }}
          renderItem={(data) => (
            <ChatSelectionItem
              {...data}
              currentlySelected={currentlySelected}
            />
          )}
        />
        {!allLoaded ? (
          <>
            <Divider />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 35,
              }}
            >
              <BigButton
                appearance="ghost"
                title="Load More"
                loading={isLoadingMore}
                onPress={onLoadMoreResults}
              />
            </View>
          </>
        ) : undefined}
      </>
    );
  },
);

export default ChatSelectionList;
