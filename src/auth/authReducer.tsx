import { Reducer } from 'react';
import createReducerContext from '../util/createReducerContext';

/**
 * STATE TYPES
 */
export default interface IProfile {
  webId: string;
  image?: string;
  name?: string;
  defaultStorageLocation: string;
  searchable?: boolean;
}

export interface IAuthState {
  profile?: IProfile;
  isLoading: boolean;
}

/**
 * ACTION TYPES
 */
export enum AuthActionType {
  LOGGED_IN,
  LOGGED_OUT,
}

export interface IBaseAuthAction {
  type: AuthActionType;
}

export interface ILoggedInAction extends IBaseAuthAction {
  type: AuthActionType.LOGGED_IN;
  profile: IProfile;
}

export interface ILoggedOutAction extends IBaseAuthAction {
  type: AuthActionType.LOGGED_OUT;
}

export type IAuthAction = ILoggedInAction | ILoggedOutAction;

/**
 * REDUCER
 */
export const authReducer: Reducer<IAuthState, IAuthAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case AuthActionType.LOGGED_IN:
      return {
        profile: action.profile,
        isLoading: false,
      };
    case AuthActionType.LOGGED_OUT:
      return {
        isLoading: false,
      };
      break;
    default:
      throw new Error('Action type not recognized');
  }
};

/**
 * Initial State
 */
export const initialAuthState: IAuthState = {
  isLoading: true,
};

/**
 * REDUCER CONTEXT
 */
const reducerContext = createReducerContext(authReducer, initialAuthState);

export const AuthContext = reducerContext.context;
export const AuthProvider = reducerContext.provider;
