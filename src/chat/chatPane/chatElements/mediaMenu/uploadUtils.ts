import { Platform } from 'react-native';
import {
  lookup as mimeTypeLookup,
  extension as extensionLookup,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from 'react-native-mime-types';
import authFetch from '../../../../util/authFetch';
import IMediaData, { IMediaType } from './IMediaData';

export function getMimeTypeFromUri(
  uri: string,
): { mimeType: string; fileExtension: string } {
  if (uri.startsWith('data:')) {
    const beforeSemi = uri.split(';')[0];
    const mimeType = beforeSemi.substring(5);
    const fileExtension = extensionLookup(mimeType);
    return { mimeType, fileExtension };
  } else {
    const mimeType = mimeTypeLookup(uri) || 'application/octet-stream';
    const fileExtension = extensionLookup(mimeType);
    return { mimeType, fileExtension };
  }
}

function dataURItoBlob(dataUri: string, mimeType: string): Blob {
  const byteString = atob(dataUri.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

export async function uploadMedia(
  media: IMediaData,
  chatUri: string,
): Promise<string> {
  // Make media name
  let fileName: string;
  if (media.name) {
    const rawName = media.name.split('.').slice(0, -1).join('.');
    fileName = `${rawName}-${media.identifier}.${media.fileExtension}`;
  } else {
    fileName = `${media.identifier}.${media.fileExtension}`;
  }
  const requestUri = `/file-upload?chat_uri=${encodeURIComponent(
    chatUri,
  )}&file_name=${fileName}&mime_type=${media.mimeType}`;

  // Create form data for each platform
  const formData = new FormData();
  if (Platform.OS !== 'web') {
    // For all mobile images and files
    formData.append('file', {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      uri: media.content.uri,
      name: fileName,
      type: media.mimeType,
    });
  } else if (media.type === IMediaType.file) {
    // File uploaded on web client
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formData.append('file', media.content.file);
  } else if (media.type === IMediaType.image) {
    // Image uploaded on on web client
    formData.append('file', dataURItoBlob(media.content.uri, media.mimeType));
  }

  const result = await authFetch(
    requestUri,
    {
      method: 'POST',
      body: formData,
      headers: {},
    },
    {
      expectedStatus: 201,
    },
  );
  if (result.status === 201) {
    return await result.text();
  }
  throw new Error('File upload problem.');

  /**
   * Make request for files and images on mobile
   */
  // const formData = new FormData();
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // formData.append('file', {
  //   // @ts-ignore
  //   uri: media.content.uri,
  //   name: fileName,
  //   type: media.mimeType,
  // });
  // const result = await authFetch(requestUri, {
  //   method: 'POST',
  //   body: formData,
  //   headers: {},
  // });
  // console.log(result.status);
  // return 'string';

  /**
   * Make request for images on web
   */
  // const formData = new FormData();
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // formData.append('file', dataURItoBlob(media.content.uri, media.mimeType));
  // const result = await authFetch(requestUri, {
  //   method: 'POST',
  //   body: formData,
  //   headers: {},
  // });
  // console.log(result.status);
  // return 'string';

  /**
   * Make request for files on web
   */
  // const formData = new FormData();
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // formData.append('file', media.content.file);
  // const result = await authFetch(requestUri, {
  //   method: 'POST',
  //   body: formData,
  //   headers: {},
  // });
  // console.log(result.status);
  // return 'string';
}
