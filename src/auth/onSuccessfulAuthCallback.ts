import { Dispatch } from 'react';
import { parse } from 'url';
import { IAuthAction } from './authReducer';
import authFetch from '../util/authFetch';
import { AuthActionType } from '../auth/authReducer';
import * as ClientStorage from '../util/clientStorage';

export async function onSuccessfulAuthCallback(
  callbackUrl: string,
  authDispatch: Dispatch<IAuthAction>,
  onSuccessfulLogin?: () => void,
): Promise<void> {
  const parsedUrl = parse(callbackUrl, true);
  const key = Array.isArray(parsedUrl.query.key)
    ? parsedUrl.query.key[0]
    : parsedUrl.query.key;
  if (key) {
    await ClientStorage.setItem('authkey', key);
  }
  const response = await authFetch(`/profile/authenticated`, undefined, {
    expectedStatus: 200,
    errorHandlers: {
      '404': async () => {
        authDispatch({
          type: AuthActionType.REQUIRES_ONBOARDING,
          profileRequiresOnboarding: true,
        });
        if (onSuccessfulLogin) {
          onSuccessfulLogin();
        }
      },
    },
  });
  if (response.status === 200) {
    const profile = await response.json();
    authDispatch({ type: AuthActionType.LOGGED_IN, profile });
    if (onSuccessfulLogin) {
      onSuccessfulLogin();
    }
  }
}
