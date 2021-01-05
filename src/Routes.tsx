import React, { FunctionComponent } from 'react';
import { Route, Router, Switch, BackButton } from './router';
import OnboardFlow from './onboard/OnboardFlow';
import ChatApp from './chat/ChatApp';
import Home from './home/Home';
import AuthHandler from './auth/AuthHandler';
import { DeepLinking } from 'react-router-native';

export const Routes: FunctionComponent = () => {
  return (
    <>
      <DeepLinking />
      <Router>
        <BackButton>
          <AuthHandler>
            <Switch>
              <Route path="/onboard" component={OnboardFlow} />
              <Route path="/chat" component={ChatApp} />
              <Route path="/" component={Home} />
            </Switch>
          </AuthHandler>
        </BackButton>
      </Router>
    </>
  );
};
