import React from 'react';
import { Layout, Spinner } from '@ui-kitten/components';
import { FunctionComponent } from 'react';

const FullPageSpinner: FunctionComponent = () => {
  return (
    <Layout style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="large" />
    </Layout>
  );
};

export default FullPageSpinner;
