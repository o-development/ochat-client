import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { Composer, ComposerProps } from 'react-native-gifted-chat';
import { v4 } from 'uuid';
import getThemeVars from '../../../common/getThemeVars';
import IAugmentedGiftedChatMessage from '../IAugmentedGiftedChatMessage';
import IMediaData, { IMediaType } from './mediaMenu/IMediaData';
import { getMimeTypeFromUri } from './mediaMenu/uploadUtils';

interface CustomComposerProps extends ComposerProps {
  onNewMedia: (mediaData: IMediaData[]) => void;
  customOnSend: (
    messages:
      | Partial<IAugmentedGiftedChatMessage>
      | Partial<IAugmentedGiftedChatMessage>[],
    shouldResetInputToolbar: boolean,
  ) => void;
}

const CustomComposer: FunctionComponent<CustomComposerProps> = ({
  onNewMedia,
  customOnSend,
  ...restProps
}) => {
  const { basicTextColor } = getThemeVars();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [
    savedTextRef,
    setSavedTextRef,
  ] = useState<RefObject<HTMLTextAreaElement> | null>(null);

  useEffect(() => {
    if (textRef !== savedTextRef && textRef != null && Platform.OS === 'web') {
      setSavedTextRef(textRef);
      textRef.current?.addEventListener('paste', (event) => {
        const items = event.clipboardData?.items;
        for (const index in items) {
          // This works, trust me
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const item = items[index];
          if (item.kind === 'file') {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
              if (readerEvent.target?.result) {
                const photoUri = readerEvent.target.result as string;
                onNewMedia([
                  {
                    type: IMediaType.image,
                    identifier: v4(),
                    content: {
                      width: 0,
                      height: 0,
                      uri: photoUri,
                    },
                    ...getMimeTypeFromUri(photoUri),
                  },
                ]);
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      });
    }
  }, [onNewMedia, savedTextRef]);

  return (
    <Composer
      {...restProps}
      textInputProps={{
        returnKeyType: 'send',
        // The element does have a ref, it's just not in the typings
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref: textRef,
        onKeyPress: async (e) => {
          if (Platform.OS === 'web') {
            // Submit when press enter
            const castNativeEvent = (e.nativeEvent as unknown) as {
              shiftKey: boolean;
              metaKey: boolean;
              ctrlKey: boolean;
              key: string;
            };
            if (castNativeEvent.key === 'Enter' && !castNativeEvent.shiftKey) {
              e.preventDefault();
              customOnSend({ text: restProps.text?.trim() }, true);
            }
          }
        },
        onSubmitEditing: () => {
          customOnSend({ text: restProps.text?.trim() }, true);
        },
        blurOnSubmit: false,
      }}
      multiline={true}
      textInputStyle={[
        restProps.textInputStyle,
        {
          color: basicTextColor,
          fontSize: 15,
        },
      ]}
    />
  );
};

export default CustomComposer;
