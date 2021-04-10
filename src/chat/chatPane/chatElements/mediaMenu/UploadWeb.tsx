import { Button, Icon } from '@ui-kitten/components';
import React, { FunctionComponent, useCallback } from 'react';
import getThemeVars from '../../../../common/getThemeVars';
import { useFilePicker } from 'use-file-picker';

const UploadWeb: FunctionComponent = () => {
  const { themeColor } = getThemeVars();

  const [files, errors, openFileSelector] = useFilePicker({
    multiple: true,
    accept: '.png,.jpg,.jpeg,.gif,.mp4,.mov,.wmv,.webm',
  });

  console.log(files);
  console.log(errors);

  const handleFileUpload = useCallback(async (): Promise<void> => {
    console.log('File upload');
    openFileSelector();
  }, [openFileSelector]);

  return (
    <Button
      appearance="ghost"
      size={'small'}
      style={{ width: 38, height: 44 }}
      onPress={handleFileUpload}
      accessoryLeft={(props) => (
        <Icon
          {...props}
          name="image-outline"
          fill={themeColor}
          style={{ height: 28, width: 28 }}
        />
      )}
    />
  );
};

export default UploadWeb;
