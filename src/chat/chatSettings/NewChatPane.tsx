import React, { FunctionComponent, useState } from 'react';
import { useLocation } from '../../router';
import { parse as parseQs, ParsedQs } from 'qs';
import useAsyncEffect from 'use-async-effect';
import FullPageSpinner from '../../common/FullPageSpinner';
import { IChat, IChatParticipant } from '../chatReducer';
import authFetch from '../../util/authFetch';
import IProfile from '../../auth/authReducer';
import { addParticipantToParticipantList } from './modifyParticipants';
import AdminSettings from './AdminSettings';
import SettingsMenuTemplate from '../common/SettingsMenuTemplate';
import { TabBar, Tab } from '@ui-kitten/components';
import { View } from 'react-native';
import LinkChatPane from './LinkChatPane';

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
  const [isLinkChatShowing, setIsLinkChatShowing] = useState(false);

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
    if (parsedQuery.subject && typeof parsedQuery.subject === 'string') {
      initialData.subject = parsedQuery.subject;
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
    <SettingsMenuTemplate
      title={'New Chat'}
      closeButton={false}
      backButton={true}
      mobileRender={mobileRender}
    >
      <View style={{ marginBottom: 16 }}>
        <TabBar
          selectedIndex={isLinkChatShowing ? 1 : 0}
          onSelect={(index) => setIsLinkChatShowing(index === 1)}
        >
          <Tab title="Create a New Chat" />
          <Tab title="Link an Existing Chat from your Solid Pod" />
        </TabBar>
      </View>
      {!isLinkChatShowing ? (
        <AdminSettings
          initialChatData={initialData}
          mobileRender={mobileRender}
        />
      ) : (
        <LinkChatPane />
      )}
    </SettingsMenuTemplate>
  );
};

export default NewChatPane;
