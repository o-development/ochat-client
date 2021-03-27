import React, { FunctionComponent, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import FullPageSpinner from '../../common/FullPageSpinner';
import authFetch from '../../util/authFetch';

interface SetUpTypeIndexProps {
  onComplete: () => void;
}

const SetUpTypeIndex: FunctionComponent<SetUpTypeIndexProps> = ({
  onComplete,
}) => {
  const [makingRequest, setMakingRequest] = useState(false);
  useAsyncEffect(async () => {
    if (!makingRequest) {
      setMakingRequest(true);
      await authFetch(
        '/chat/authenticated',
        { method: 'POST' },
        { expectedStatus: 201, doNotUseDefaultErrorHandlers: true },
      );
      onComplete();
    }
  });

  return <FullPageSpinner />;
};

export default SetUpTypeIndex;
