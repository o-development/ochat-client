import { Button, Icon } from '@ui-kitten/components';
import React, { FunctionComponent, useCallback } from 'react';
import getThemeVars from '../../../../common/getThemeVars';
import { getDocumentAsync } from 'expo-document-picker';
import { Platform, View } from 'react-native';
import authFetch from '../../../../util/authFetch';

const UploadMobile: FunctionComponent = () => {
  const { themeColor } = getThemeVars();

  const handleFileUpload = useCallback(async (): Promise<void> => {
    const document = await getDocumentAsync({ multiple: true });
    if (document.type !== 'success') {
      return;
    }
    if (Platform.OS === 'web') {
      const formData = new FormData();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      formData.append('file', document.file);
      const result = await authFetch('/file-upload', {
        method: 'POST',
        body: formData,
        headers: {},
      });
      console.log(result.status);
    } else {
      const formData = new FormData();
      formData.append('file', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        uri: document.uri,
        name: document.name,
        type: 'image/jpg',
      });
      const result = await authFetch('/file-upload', {
        method: 'POST',
        body: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
      console.log(result.status);
    }
  }, []);

  return (
    <Button
      appearance="ghost"
      size={'small'}
      style={{ width: 38, height: 44 }}
      onPress={handleFileUpload}
      accessoryLeft={(props) => (
        <View>
          <Icon
            {...props}
            name="image-outline"
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        </View>
      )}
    />
  );
};

export default UploadMobile;
