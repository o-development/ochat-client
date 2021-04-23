import debounce from 'debounce-promise';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import useAsyncEffect from 'use-async-effect';
import IProfile from '../../../auth/authReducer';
import FullPageSpinner from '../../../common/FullPageSpinner';
import authFetch from '../../../util/authFetch';
import {
  ChatActionType,
  ChatContext,
  IChat,
  IChatListData,
} from '../../chatReducer';
import ChatSelectionList from '../ChatSelectionList';

interface StandardChatListProps {
  searchTerm?: string;
  listName: string;
  currentlySelected?: string;
  chatFilterFunction: (chats: IChat | IProfile) => boolean;
}

const StandardChatList: FunctionComponent<StandardChatListProps> = ({
  searchTerm,
  listName,
  currentlySelected,
  chatFilterFunction,
}) => {
  const [chatState, chatDispatch] = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [oldSearchTerm, setOldSearchTerm] = useState<string | undefined>('');
  const [searchResults, setSearchResults] = useState<(IChat | IProfile)[]>([]);
  const [loadingMoreChats, setLoadingMoreChats] = useState(false);
  const [didInitialFetch, setDidInitialFetch] = useState(false);

  // All Chats to display
  const rawChatResults = JSON.stringify(chatState.chats);
  const chatResults = useMemo((): (IChat | IProfile)[] => {
    return (Object.values(chatState.chats)
      .map((chatData) => chatData.chat)
      .filter((chat): boolean => !!chat) as IChat[])
      .filter(chatFilterFunction)
      .sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) {
          return 0;
        } else if (!a.lastMessage) {
          return 1;
        } else if (!b.lastMessage) {
          return -1;
        }
        const aTime = a.lastMessage.timeCreated;
        const bTime = b.lastMessage.timeCreated;
        if (aTime > bTime) {
          return -1;
        } else if (aTime < bTime) {
          return 1;
        } else {
          return 0;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatFilterFunction, chatState.chats, rawChatResults]);

  // Function that fetches search results
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSearchResults = useCallback(
    debounce(async (newTerm: string) => {
      setLoading(true);
      const result = await authFetch(
        `/chat/search?term=${newTerm}${
          listName === 'discover' ? '&discoverable=true' : ''
        }`,
        {
          method: 'post',
        },
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody: {
          chats: IChat[];
          profiles?: IProfile[];
        } = await result.json();
        setSearchResults([...resultBody.chats, ...(resultBody.profiles || [])]);
      }
      setLoading(false);
    }, 1000),
    [setLoading],
  );

  // Function that fetches results
  const fetchResults = useCallback(
    async (pageNumber: number): Promise<void> => {
      const result = await authFetch(
        `/chat/search?page=${pageNumber}${
          listName === 'discover' ? '&discoverable=true' : ''
        }`,
        {
          method: 'post',
        },
        { expectedStatus: 200 },
      );
      if (result.status === 200) {
        const resultBody: {
          chats: IChat[];
          profiles?: IProfile[];
        } = await result.json();
        chatDispatch({
          type: ChatActionType.UPDATE_CHAT,
          chats: resultBody.chats,
          performedAction: 'initialChatListFetch',
          lists: {
            [listName]: {
              lastPageLoaded: pageNumber,
              allChatsLoaded: resultBody.chats.length === 0,
            },
          },
        });
      }
    },
    [chatDispatch, listName],
  );

  // Fetch more results when load more if clicked
  const rawListData = JSON.stringify(chatState.lists);
  const fetchMoreResults = useCallback(
    async () => {
      const listData: IChatListData | undefined = chatState.lists[listName];
      // Return if already loaded all the chats
      if (listData && (listData.allChatsLoaded || loadingMoreChats)) {
        return;
      }

      const curPage = listData ? listData.lastPageLoaded : -1;
      // Return if already started to load current page
      if (listData && listData.pageFetchAttempts.has(curPage + 1)) {
        return;
      }
      setLoadingMoreChats(true);
      await fetchResults(curPage + 1);
      setLoadingMoreChats(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatDispatch, loadingMoreChats, chatState.lists, rawListData],
  );

  // Perform Search
  useAsyncEffect(async () => {
    if (oldSearchTerm !== searchTerm) {
      setOldSearchTerm(searchTerm);
      if (!searchTerm) {
        setSearchResults([]);
      } else {
        await fetchSearchResults(searchTerm);
      }
    }
  }, [oldSearchTerm, searchTerm, fetchSearchResults]);

  // Do Initial Fetch
  useAsyncEffect(async () => {
    if (
      !chatState.lists[listName] ||
      chatState.lists[listName].lastPageLoaded === -1
    ) {
      setDidInitialFetch(true);
      await fetchMoreResults();
    } else if (!didInitialFetch) {
      setDidInitialFetch(true);
      await fetchResults(0);
    }
  });

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <ChatSelectionList
      onLoadMoreResults={fetchMoreResults}
      currentlySelected={currentlySelected}
      isLoadingMore={loadingMoreChats}
      allLoaded={chatState.lists[listName].allChatsLoaded}
      chatList={searchTerm ? searchResults : chatResults}
    />
  );
};

export default StandardChatList;
