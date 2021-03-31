import React, { FunctionComponent, useContext, useState } from 'react';
import PushNotifications from './pages/PushNotifications';
import PersonIndexRequest from './pages/PersonIndexRequest';
import FullPageSpinner from '../common/FullPageSpinner';
import { AuthActionType, AuthContext } from '../auth/authReducer';
import OnboardPrivacyPolicy from './pages/OnboardPrivacyPolicy';
import SetUpTypeIndex from './pages/SetUpTypeIndex';

enum OnboardPage {
  PRIVACY_POLICY,
  PERSON_INDEX_REQUEST,
  PUSH_NOTIFICATIONS,
  TYPE_INDEX,
}

const OnboardFlow: FunctionComponent = () => {
  const [, dispatchAuthState] = useContext(AuthContext);
  const [page, setPage] = useState<OnboardPage>(OnboardPage.PRIVACY_POLICY);
  switch (page) {
    case OnboardPage.PRIVACY_POLICY:
      return (
        <OnboardPrivacyPolicy
          onComplete={() => setPage(OnboardPage.PERSON_INDEX_REQUEST)}
        />
      );
    case OnboardPage.PERSON_INDEX_REQUEST:
      return (
        <PersonIndexRequest
          onComplete={() => setPage(OnboardPage.PUSH_NOTIFICATIONS)}
        />
      );
    case OnboardPage.PUSH_NOTIFICATIONS:
      return (
        <PushNotifications onComplete={() => setPage(OnboardPage.TYPE_INDEX)} />
      );
    case OnboardPage.TYPE_INDEX:
      return (
        <SetUpTypeIndex
          onComplete={() =>
            dispatchAuthState({
              type: AuthActionType.REQUIRES_ONBOARDING,
              profileRequiresOnboarding: false,
            })
          }
        />
      );
    default:
      return <FullPageSpinner />;
  }
};

export default OnboardFlow;
