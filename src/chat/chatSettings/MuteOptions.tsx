import { FunctionComponent, ReactElement, useCallback, useState } from 'react';
import React from 'react';
import { View } from 'react-native';
import { Radio, RadioGroup, RadioProps, Text } from '@ui-kitten/components';
import authFetch from '../../util/authFetch';
import useAsyncEffect from 'use-async-effect';

export interface INotificationMuteSetting {
  chatUri: string;
  expires?: {
    duration: number;
    time: string;
  };
}

interface MuteOptionsProps {
  chatUri: string;
}

const muteIntervals: { duration: number; description: string }[] = [
  { duration: 15 * 60 * 1000, description: '15 minutes' },
  { duration: 60 * 60 * 1000, description: '1 hour' },
  { duration: 8 * 60 * 60 * 1000, description: '8 hours' },
  { duration: 24 * 60 * 60 * 1000, description: '24 hours' },
];

const MuteOptions: FunctionComponent<MuteOptionsProps> = ({ chatUri }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [timeoutObj, setTimeoutObj] = useState<NodeJS.Timeout | null>(null);
  const [didInitialFetch, setDidInitialFetch] = useState(false);

  const handleNewMuteSetting = useCallback(
    (muteSetting: INotificationMuteSetting | null) => {
      if (timeoutObj) {
        clearTimeout(timeoutObj);
        setTimeoutObj(null);
      }
      if (!muteSetting) {
        setSelectedIndex(null);
      } else if (!muteSetting.expires) {
        setSelectedIndex(muteIntervals.length);
      } else {
        setSelectedIndex(
          muteIntervals.findIndex(
            (interval) => interval.duration === muteSetting.expires?.duration,
          ),
        );
        const newTimeoutObj = setTimeout(() => {
          handleNewMuteSetting(null);
        }, new Date(muteSetting.expires.time).getTime() - new Date().getTime());
        setTimeoutObj(newTimeoutObj);
      }
    },
    [timeoutObj],
  );

  const onRadioPressed = useCallback(
    async (index: number) => {
      if (index === selectedIndex) {
        // Turn off the mute
        const result = await authFetch(
          `/notification-mute-setting/${encodeURIComponent(chatUri)}`,
          { method: 'delete' },
          { expectedStatus: 200 },
        );
        if (result.status === 200) {
          handleNewMuteSetting(null);
        }
        return;
      }
      let muteSetting: INotificationMuteSetting;
      if (index === muteIntervals.length) {
        // Mute all with no time limit
        muteSetting = {
          chatUri,
        };
      } else {
        const { duration } = muteIntervals[index];
        muteSetting = {
          chatUri,
          expires: {
            duration,
            time: new Date(new Date().getTime() + duration).toString(),
          },
        };
      }
      const result = await authFetch(
        '/notification-mute-setting',
        {
          method: 'post',
          body: JSON.stringify(muteSetting),
          headers: {
            'content-type': 'application/json',
          },
        },
        {
          expectedStatus: 200,
        },
      );
      if (result.status === 200) {
        handleNewMuteSetting(muteSetting);
      }
    },
    [chatUri, handleNewMuteSetting, selectedIndex],
  );

  useAsyncEffect(async () => {
    if (!didInitialFetch) {
      setDidInitialFetch(true);
      const result = await authFetch(
        `/notification-mute-setting/${encodeURIComponent(chatUri)}`,
        undefined,
        {
          expectedStatus: 200,
          errorHandlers: {
            '404': async () => {
              /* Do Nothing */
            },
          },
        },
      );
      if (result.status === 200) {
        const muteSetting: INotificationMuteSetting = await result.json();
        handleNewMuteSetting(muteSetting);
      } else if (result.status === 404) {
        handleNewMuteSetting(null);
      }
    }
  });

  return (
    <View style={{ alignItems: 'flex-start' }}>
      <Text category="h3" style={{ marginVertical: 16 }}>
        Mute Options
      </Text>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <RadioGroup selectedIndex={selectedIndex} onChange={onRadioPressed}>
        {muteIntervals.map(
          (interval): ReactElement<RadioProps> => (
            <Radio
              key={interval.duration}
            >{`Mute notifications for ${interval.description}`}</Radio>
          ),
        )}
        <Radio>Mute notifications until I turn it back on</Radio>
      </RadioGroup>
    </View>
  );
};

export default MuteOptions;
