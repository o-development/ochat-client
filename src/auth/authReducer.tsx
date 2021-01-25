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
  requiresOnboarding: boolean;
}

/**
 * ACTION TYPES
 */
export enum AuthActionType {
  LOGGED_IN,
  LOGGED_OUT,
  REQUIRES_ONBOARDING,
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

export interface IRequiresOnboardingAction extends IBaseAuthAction {
  type: AuthActionType.REQUIRES_ONBOARDING;
  profileRequiresOnboarding: boolean;
}

export type IAuthAction =
  | ILoggedInAction
  | ILoggedOutAction
  | IRequiresOnboardingAction;

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
        ...state,
        profile: action.profile,
        isLoading: false,
      };
    case AuthActionType.LOGGED_OUT:
      return {
        ...state,
        profile: undefined,
        isLoading: false,
      };
    case AuthActionType.REQUIRES_ONBOARDING:
      return {
        ...state,
        requiresOnboarding: action.profileRequiresOnboarding,
      };
    default:
      throw new Error('Action type not recognized');
  }
};

/**
 * Initial State
 */
export const initialAuthState: IAuthState = {
  isLoading: true,
  requiresOnboarding: false,
};

/**
 * REDUCER CONTEXT
 */
const reducerContext = createReducerContext(authReducer, initialAuthState);

export const AuthContext = reducerContext.context;
export const AuthProvider = reducerContext.provider;
