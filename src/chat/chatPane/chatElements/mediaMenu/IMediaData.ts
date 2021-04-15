import { DocumentResult } from 'expo-document-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';

export enum IMediaType {
  image = 'image',
  file = 'file',
}

type IMediaData = IImageData | IFileData;
export default IMediaData;

export interface IMediaDataBase {
  type: IMediaType;
  identifier: string;
  name?: string;
  mimeType: string;
  fileExtension: string;
}

export interface IImageData extends IMediaDataBase {
  type: IMediaType.image;
  content: ImageInfo;
}

export interface IFileData extends IMediaDataBase {
  type: IMediaType.file;
  identifier: string;
  name?: string;
  content: DocumentResult;
}
