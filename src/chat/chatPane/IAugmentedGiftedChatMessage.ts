import { IMessage } from 'react-native-gifted-chat';

export default interface IAugmentedGiftedChatMessage extends IMessage {
  isInvalid?: boolean;
  file?: string;
}
