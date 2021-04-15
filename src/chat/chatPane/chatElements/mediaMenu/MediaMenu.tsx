import { Button, Icon, Modal } from '@ui-kitten/components';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
  Platform,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { getDocumentAsync } from 'expo-document-picker';
import getThemeVars from '../../../../common/getThemeVars';
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
  launchCameraAsync,
} from 'expo-image-picker';
import IMediaData, { IMediaType } from './IMediaData';
import { v4 } from 'uuid';
import { AssetsSelector } from 'expo-images-picker';
import { Ionicons } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import errorToast from '../../../../util/errorToast';
import { getMimeTypeFromUri } from './uploadUtils';

interface MediaMenuProps {
  onNewMedia(newMedia: IMediaData[]): void;
  style?: StyleProp<ViewStyle>;
}

const MediaMenu: FunctionComponent<MediaMenuProps> = ({
  onNewMedia,
  style,
}) => {
  const { themeColor, backgroundColor1 } = getThemeVars();
  const [
    multipleImageBrowserShowing,
    setMultipleImageBrowserShowing,
  ] = useState(false);

  /**
   * Handle Camera on Mobile
   */
  const handleCamera = useCallback(async (): Promise<void> => {
    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.cancelled) {
      onNewMedia([
        {
          type: IMediaType.image,
          identifier: v4(),
          content: result,
          ...getMimeTypeFromUri(result.uri),
        },
      ]);
    }
  }, [onNewMedia]);

  /**
   * Handle Image on Web, if we're on mobile, it pops up the mobile image
   * selection view
   */
  const handleImage = useCallback(async (): Promise<void> => {
    if (Platform.OS === 'web') {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        quality: 1,
        allowsMultipleSelection: true,
      });
      if (!result.cancelled) {
        onNewMedia(
          result.selected.map((info) => {
            return {
              type: IMediaType.image,
              identifier: v4(),
              content: info,
              ...getMimeTypeFromUri(info.uri),
            };
          }),
        );
      }
    } else {
      setMultipleImageBrowserShowing(true);
    }
  }, [onNewMedia]);

  /**
   * Handles uploading a file for both web and mobile
   */
  const handleFile = useCallback(async (): Promise<void> => {
    const document = await getDocumentAsync({ multiple: false });
    if (document.type === 'success') {
      if (document.name) {
        // const nameSplit = document.name.split('.');
        // const fileExtension = nameSplit[nameSplit.length - 1];
        // const mimeType =
        //   document.file?.type ||
        //   mimeTypeLookup(fileExtension) ||
        //   'application/octet-stream';
        onNewMedia([
          {
            type: IMediaType.file,
            identifier: v4(),
            name: document.name,
            content: document,
            ...getMimeTypeFromUri(document.uri),
          },
        ]);
      } else {
        errorToast('Could not deduce file type.');
      }
    }
  }, [onNewMedia]);

  /**
   * Handles getting an image using the image selector (displayed on mobile)
   */
  const handlePhotoSelectionDone = useCallback(
    (data: { height: number; width: number; uri: string }[]) => {
      setMultipleImageBrowserShowing(false);
      onNewMedia(
        data.map((photoData) => {
          return {
            type: IMediaType.image,
            identifier: v4(),
            content: photoData,
            ...getMimeTypeFromUri(photoData.uri),
          };
        }),
      );
    },
    [onNewMedia],
  );

  /**
   * Render
   */
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 44,
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Modal visible={multipleImageBrowserShowing}>
        <View
          style={{
            width,
            height: height,
            marginTop: getStatusBarHeight() * 2,
            backgroundColor: 'red',
          }}
        >
          <AssetsSelector
            options={{
              manipulate: {
                width: 512,
                compress: 0.7,
                base64: false,
                saveTo: 'jpeg',
              },
              assetsType: ['photo', 'video'],
              noAssets: {
                Component: function noAssets() {
                  return <View></View>;
                },
              },
              spinnerColor: themeColor,
              maxSelections: 50,
              margin: 2,
              portraitCols: 4,
              landscapeCols: 5,
              widgetWidth: 100,
              widgetBgColor: backgroundColor1,
              videoIcon: {
                Component: Ionicons,
                iconName: 'ios-videocam',
                color: themeColor,
                size: 22,
              },
              selectedIcon: {
                Component: Ionicons,
                iconName: 'ios-checkmark-circle-outline',
                color: 'white',
                bg: `${themeColor}80`,
                size: 26,
              },
              defaultTopNavigator: {
                continueText: 'Done ',
                goBackText: 'Cancel ',
                textStyle: { color: themeColor },
                buttonStyle: {},
                backFunction: () => {
                  setMultipleImageBrowserShowing(false);
                },
                doneFunction: handlePhotoSelectionDone,
              },
            }}
          />
        </View>
      </Modal>
      {Platform.OS !== 'web' ? (
        <Button
          appearance="ghost"
          size={'small'}
          style={{ width: 38, height: 44 }}
          onPress={handleCamera}
          accessoryLeft={(props) => (
            <Icon
              {...props}
              name="camera-outline"
              fill={themeColor}
              style={{ height: 28, width: 28 }}
            />
          )}
        />
      ) : undefined}
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 38, height: 44 }}
        onPress={handleImage}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="image-outline"
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        )}
      />
      <Button
        appearance="ghost"
        size={'small'}
        style={{ width: 38, height: 44 }}
        onPress={handleFile}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            name="attach-outline"
            fill={themeColor}
            style={{ height: 28, width: 28 }}
          />
        )}
      />
    </View>
  );
};

export default MediaMenu;
