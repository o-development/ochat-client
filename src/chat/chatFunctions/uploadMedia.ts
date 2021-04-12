import { Platform } from 'react-native';
import authFetch from '../../util/authFetch';
import IMediaData, {
  IMediaType,
} from '../chatPane/chatElements/mediaMenu/IMediaData';
import IAugmentedGiftedChatMessage from '../chatPane/IAugmentedGiftedChatMessage';

export default async function uploadMedia(
  media: IMediaData,
): Promise<Partial<IAugmentedGiftedChatMessage>> {
  if (Platform.OS === 'web') {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formData.append('file', media.content.file);
    const result = await authFetch('/file-upload', {
      method: 'POST',
      body: formData,
      headers: {},
    });
    console.log(result.status);
  } else {
    if (media.type === IMediaType.file) {
      const formData = new FormData();
      formData.append('file', {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        uri: media.content.uri,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: media.content.name,
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
  }
  return {};
}
