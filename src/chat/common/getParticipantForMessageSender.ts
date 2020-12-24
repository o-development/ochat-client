import { IChat, IChatParticipant, IMessage } from '../chatReducer';

export default function getParticipantForMessageSender(
  message: IMessage,
  chat: IChat,
): IChatParticipant {
  return (
    chat.participants.find((p) => p.webId === message.maker) || {
      webId: message.maker,
      name: message.maker,
      isAdmin: false,
    }
  );
}
