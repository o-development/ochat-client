import React, { FunctionComponent, useState } from 'react';
import { useLocation } from '../../router';
import { parse as parseQs, ParsedQs } from 'qs';
import useAsyncEffect from 'use-async-effect';
import FullPageSpinner from '../../common/FullPageSpinner';
import { IChat, IChatParticipant } from '../chatReducer';
import ChatSettings from './ChatSettings';
import authFetch from '../../util/authFetch';
import IProfile from '../../auth/authReducer';
import { addParticipantToParticipantList } from './modifyParticipants';

function getStringArrayFromParsedQs(
  input: undefined | string | string[] | ParsedQs | ParsedQs[],
): string[] {
  if (!input) {
    return [];
  }
  if (typeof input === 'string') {
    return [input];
  }
  if (Array.isArray(input)) {
    const output: string[] = [];
    input.forEach((item: string | ParsedQs) => {
      if (typeof item === 'string') {
        output.push(item);
      }
    });
    return output;
  }
  return [];
}

async function getParticipantFromWebId(
  webId: string,
  isAdmin: boolean,
): Promise<IChatParticipant | undefined> {
  const result = await authFetch(
    `/profile/search?term=${encodeURIComponent(webId)}`,
    { method: 'post' },
    { expectedStatus: 200 },
  );
  if (result.status === 200) {
    const profiles = (await result.json()) as IProfile[];
    if (profiles[0]) {
      return {
        webId: profiles[0].webId,
        image: profiles[0].image,
        name: profiles[0].name,
        isAdmin,
      };
    }
  }
  return undefined;
}

export interface NewChatPaneProps {
  mobileRender: boolean;
}

const NewChatPane: FunctionComponent<NewChatPaneProps> = ({ mobileRender }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<IChat>>({});
  const [curQuery, setCurQuery] = useState(location.search);

  useAsyncEffect(async () => {
    if (curQuery !== location.search) {
      setLoading(true);
      setCurQuery(location.search);
    }
    if (!loading) {
      return;
    }
    const parsedQuery = parseQs(location.search, { ignoreQueryPrefix: true });
    const initialData: Partial<IChat> = {};
    if (parsedQuery.name && typeof parsedQuery.name === 'string') {
      initialData.name = parsedQuery.name;
    }
    const participants: IChatParticipant[] = [];
    const participantWebIds: string[] = getStringArrayFromParsedQs(
      parsedQuery.participants,
    );
    const adminWebIds: string[] = getStringArrayFromParsedQs(
      parsedQuery.administrators,
    );
    const uncleanParticipantList = await Promise.all([
      ...participantWebIds.map(async (pWebId) => {
        return await getParticipantFromWebId(pWebId, false);
      }),
      ...adminWebIds.map(async (aWebId) => {
        return await getParticipantFromWebId(aWebId, true);
      }),
    ]);
    uncleanParticipantList.forEach((uncleanParticipant) => {
      if (uncleanParticipant) {
        addParticipantToParticipantList(participants, uncleanParticipant);
      }
    });
    if (participants.length > 0) {
      initialData.participants = participants;
    }
    setInitialData(initialData);
    setLoading(false);
  });

  if (loading) {
    return <FullPageSpinner />;
  }
  return (
    <ChatSettings initialChatData={initialData} mobileRender={mobileRender} />
  );
};

export default NewChatPane;
