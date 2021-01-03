export default function getNewChatPaneUri(
  initialChatDetails: Partial<{
    name: string;
    administrators: string[];
    participants: string[];
    isPublic: boolean;
  }>,
): string {
  const searchParams = new URLSearchParams();
  if (initialChatDetails.name)
    searchParams.set('name', initialChatDetails.name);
  if (initialChatDetails.participants)
    initialChatDetails.participants.forEach((p) =>
      searchParams.append('participants', p),
    );
  if (initialChatDetails.administrators)
    initialChatDetails.administrators.forEach((p) =>
      searchParams.append('administrators', p),
    );
  if (initialChatDetails.isPublic)
    searchParams.set('isPublic', JSON.stringify(initialChatDetails.isPublic));
  return `/chat/new?${searchParams.toString()}`;
}
