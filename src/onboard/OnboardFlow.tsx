import React, { FunctionComponent } from 'react';
import AuthCallback from './pages/AuthCallback';
import PushNotifications from './pages/PushNotifications';
import { Switch, Route } from '../router';
import PersonIndexRequest from './pages/PersonIndexRequest';

const OnboardFlow: FunctionComponent = () => {
  return (
    <Switch>
      <Route path={`/onboard/callback`} component={AuthCallback} />
      <Route
        path={`/onboard/person_index_request`}
        component={PersonIndexRequest}
      />
      <Route
        path={`/onboard/push_notifications`}
        component={PushNotifications}
      />
    </Switch>
  );
};

export default OnboardFlow;
