import { IChatParticipant } from '../chatReducer';

export function addParticipantToParticipantList(
  curParticipants: IChatParticipant[],
  newParticipant: IChatParticipant,
): IChatParticipant[] {
  const newParticipants = curParticipants;
  const duplicateIndex = newParticipants.findIndex(
    (p) => p.webId === newParticipant.webId,
  );
  if (duplicateIndex !== -1) {
    // If the participant is already present
    newParticipants[duplicateIndex].isAdmin = newParticipant.isAdmin;
  } else {
    newParticipants.push(newParticipant);
  }
  return newParticipants;
}

export function removeParticipantFromParticipantList(
  curParticipants: IChatParticipant[],
  newParticipant: IChatParticipant,
): IChatParticipant[] {
  const participantIndex = curParticipants.findIndex(
    (p) => p.webId === newParticipant.webId,
  );
  curParticipants.splice(participantIndex, 1);
  return curParticipants;
}
