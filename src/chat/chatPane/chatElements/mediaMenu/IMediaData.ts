import { DocumentResult } from 'expo-document-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';

export enum IMediaType {
  image = 'image',
  file = 'file',
}

type IMediaData = IImageData | IFileData;
export default IMediaData;

export interface IImageData {
  type: IMediaType.image;
  identifier: string;
  name?: string;
  content: ImageInfo;
}

export interface IFileData {
  type: IMediaType.file;
  identifier: string;
  name?: string;
  content: DocumentResult;
}
