import React, { Fragment, FunctionComponent, useContext } from 'react';
import useAsyncEffect from 'use-async-effect';
import authFetch from '../util/authFetch';
import { AuthActionType, AuthContext, AuthProvider } from './authReducer';

const AuthLoader: FunctionComponent = () => {
  const [authState, dispatch] = useContext(AuthContext);
  useAsyncEffect(async () => {
    // Check if the user is logged in
    if (authState.isLoading) {
      const response = await authFetch(`/profile/authenticated`, undefined, {
        expectedStatus: 200,
        errorHandlers: {
          '404': async () => {
            dispatch({
              type: AuthActionType.REQUIRES_ONBOARDING,
              profileRequiresOnboarding: true,
            });
          },
          '401': async () => {
            dispatch({ type: AuthActionType.LOGGED_OUT });
          },
        },
      });
      if (response.status === 200) {
        const profile = await response.json();
        dispatch({ type: AuthActionType.LOGGED_IN, profile });
      }
    }
  });
  return <Fragment />;
};

const AuthHandler: FunctionComponent = ({ children }) => {
  return (
    <AuthProvider>
      <AuthLoader />
      {children}
    </AuthProvider>
  );
};

export default AuthHandler;
