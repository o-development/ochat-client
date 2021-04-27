import { Reducer } from 'react';
import createReducerContext from '../util/createReducerContext';

/**
 * STATE TYPES
 */
export enum IChatType {
  LongChat = 'LongChat',
  ShortChat = 'ShortChat',
}

export interface IChatParticipant {
  name?: string;
  image?: string;
  webId: string;
  isAdmin: boolean;
}

export interface IMessage {
  id: string;
  page: string;
  maker: string;
  content: {
    text?: string[];
    image?: string[];
    file?: string[];
    video?: string[];
  };
  timeCreated: string;
  isInvalid?: boolean;
}

export interface IChat {
  uri: string;
  type: IChatType;
  name: string;
  images: string[];
  participants: IChatParticipant[];
  isPublic: boolean;
  isDiscoverable?: boolean;
  lastMessage?: IMessage;
  subject?: string;
  error?: { message: string; metadata: Record<string, unknown> };
}

export interface IChatData {
  chat?: IChat;
  messages: IMessage[];
  allMessagesLoaded: boolean;
}

export interface IChatListData {
  allChatsLoaded: boolean;
  lastPageLoaded: number;
  pageFetchAttempts: Set<number>;
}

export interface IChatState {
  chats: Record<string, IChatData>;
  performedActions: Record<string, boolean>;
  lists: Record<string, IChatListData>;
}

/**
 * ACTION TYPES
 */
export enum ChatActionType {
  UPDATE_CHAT,
  ADD_MESSAGE,
  BEGIN_CHAT_LIST_FETCH,
}

export interface IBaseChatAction {
  type: ChatActionType;
  performedAction?: string;
}

export interface IUpdateChatAction extends IBaseChatAction {
  type: ChatActionType.UPDATE_CHAT;
  chats: IChat[];
  lists?: Record<
    string,
    {
      allChatsLoaded?: boolean;
      lastPageLoaded?: number;
    }
  >;
}

export interface IAddMessageAction extends IBaseChatAction {
  type: ChatActionType.ADD_MESSAGE;
  chatId: string;
  message: IMessage | IMessage[];
  allMessagesLoaded?: boolean;
}

export interface IBeginChatListFetchAction extends IBaseChatAction {
  type: ChatActionType.BEGIN_CHAT_LIST_FETCH;
  list: string;
  pageNumber: number;
}

export type IChatAction =
  | IUpdateChatAction
  | IAddMessageAction
  | IBeginChatListFetchAction;

/**
 * REDUCER
 */
export const chatReducer: Reducer<IChatState, IChatAction> = (
  state,
  action,
) => {
  if (action.performedAction) {
    state.performedActions[action.performedAction] = true;
  }
  switch (action.type) {
    case ChatActionType.UPDATE_CHAT:
      const newChatMap: Record<string, IChatData> = state.chats;
      action.chats.forEach((newChat) => {
        newChatMap[newChat.uri] = {
          ...(state.chats[newChat.uri] || {
            messages: [],
            allMessagesLoaded: false,
          }),
          chat: {
            ...(state.chats[newChat.uri]?.chat || {}),
            ...newChat,
          },
        };
      });
      const toReturn = {
        ...state,
        chats: newChatMap,
      };
      if (action.lists) {
        Object.entries(action.lists).forEach(([key, value]) => {
          toReturn.lists[key] = {
            ...toReturn.lists[key],
            ...value,
          };
        });
      }
      return toReturn;
      break;
    case ChatActionType.ADD_MESSAGE:
      const newMessages = Array.isArray(action.message)
        ? action.message
        : [action.message];
      if (!state.chats[action.chatId]) {
        state.chats[action.chatId] = { messages: [], allMessagesLoaded: false };
      }
      const currentMessages = state.chats[action.chatId].messages;
      newMessages.forEach((newMessage) => {
        // Prevent a duplicate message
        const duplicateMessageIndex = currentMessages.findIndex(
          (oldMessage) => oldMessage.id === newMessage.id,
        );
        if (duplicateMessageIndex > -1) {
          currentMessages[duplicateMessageIndex] = newMessage;
        } else {
          currentMessages.push(newMessage);
        }
      });

      return {
        ...state,
        chats: {
          ...state.chats,
          [action.chatId]: {
            ...state.chats[action.chatId],
            messages: currentMessages.sort((a, b) => {
              if (a.timeCreated > b.timeCreated) {
                return -1;
              } else if (a.timeCreated < b.timeCreated) {
                return 1;
              } else {
                return 0;
              }
            }),
            allMessagesLoaded: action.allMessagesLoaded || false,
          },
        },
      };
      break;
    case ChatActionType.BEGIN_CHAT_LIST_FETCH:
      if (!state.lists[action.list]) {
        state.lists[action.list] = {
          lastPageLoaded: -1,
          allChatsLoaded: false,
          pageFetchAttempts: new Set(),
        };
      }
      state.lists[action.list].pageFetchAttempts.add(action.pageNumber);
      return state;
      break;
    default:
      throw new Error('Action type not recognized');
  }
};

/**
 * Initial State
 */
export const initialChatState: IChatState = {
  chats: {},
  lists: {
    default: {
      lastPageLoaded: -1,
      allChatsLoaded: false,
      pageFetchAttempts: new Set(),
    },
    discover: {
      lastPageLoaded: -1,
      allChatsLoaded: false,
      pageFetchAttempts: new Set(),
    },
  },
  performedActions: {},
};

/**
 * REDUCER CONTEXT
 */
const reducerContext = createReducerContext(chatReducer, initialChatState);

export const ChatContext = reducerContext.context;
export const ChatProvider = reducerContext.provider;
