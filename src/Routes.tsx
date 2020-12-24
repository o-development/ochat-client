import React, { FunctionComponent } from 'react';
import { Route, Router, Switch, BackButton, useHistory } from './router';
import OnboardFlow from './onboard/OnboardFlow';
import ChatApp from './chat/ChatApp';
import { Linking } from 'react-native';
import { MOBILE_URL } from './const.json';
import Home from './home/Home';
import AuthHandler from './auth/AuthHandler';

export const Routes: FunctionComponent = () => {
  const history = useHistory();
  Linking.addEventListener('url', (link) => {
    if (link) {
      history.push(link.url.replace(MOBILE_URL, ''));
    }
  });

  return (
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
  );
};
