import React, { FunctionComponent } from 'react';
import UploadMobile from './UploadMobile';

const UploadButton: FunctionComponent = () => {
  // return Platform.OS === 'web' ? <UploadWeb /> : <UploadMobile />;
  return <UploadMobile />;
};

export default UploadButton;
