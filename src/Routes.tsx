import React, { FunctionComponent } from 'react';
import { Route, Router, Switch, BackButton } from './router';
import AuthCallback from './auth/AuthCallback';
import ChatApp from './chat/ChatApp';
import Home from './home/Home';
import AuthHandler from './auth/AuthHandler';
import { DeepLinking } from 'react-router-native';
import { Platform } from 'react-native';
import NotificationInitializer from './NotificationInitializer';
import PrivacyPolicy from './home/PrivacyPolicy';

export const Routes: FunctionComponent = () => {
  return (
    <Router>
      {Platform.OS !== 'web' ? <DeepLinking /> : undefined}
      <BackButton>
        <AuthHandler>
          <Switch>
            <Route path="/auth-callback" component={AuthCallback} />
            <Route path="/chat" component={ChatApp} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/" component={Home} />
          </Switch>
          <NotificationInitializer />
        </AuthHandler>
      </BackButton>
    </Router>
  );
};
