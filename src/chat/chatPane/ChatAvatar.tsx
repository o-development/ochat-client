import { Tooltip } from '@ui-kitten/components';
import React, { FunctionComponent, useState } from 'react';
import { Pressable } from 'react-native';
import {
  Avatar,
  AvatarProps,
  IMessage as IGiftedChatMessage,
} from 'react-native-gifted-chat';
import GroupImage from '../common/GroupImage';

const ChatAvatar: FunctionComponent<AvatarProps<IGiftedChatMessage>> = (
  props,
) => {
  const participant = props.currentMessage?.user;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return (
    <Tooltip
      anchor={() => {
        return (
          <Pressable onPress={() => setTooltipOpen(true)}>
            <Avatar
              {...props}
              renderAvatar={() => {
                return (
                  <GroupImage
                    images={
                      participant?.avatar &&
                      typeof participant.avatar === 'string' &&
                      participant.avatar !== 'default'
                        ? [participant.avatar]
                        : []
                    }
                    width={28}
                  />
                );
              }}
            />
          </Pressable>
        );
      }}
      visible={tooltipOpen}
      placement="top start"
      onBackdropPress={() => setTooltipOpen(false)}
    >
      {participant?.name || participant?._id || ''}
    </Tooltip>
  );
  // return (
  //   <Tooltip
  //     anchor={() => {
  //       return (
  //         <TouchableOpacity onPress={() => setTooltipOpen(true)}>
  //           <GroupImage
  //             images={participant.image ? [participant.image] : []}
  //             width={35}
  //           />
  //       );
  //     }}
  //     visible={tooltipOpen}
  //     placement="top start"
  //     onBackdropPress={() => setTooltipOpen(false)}
  //   >
  //     {participant.name || participant.webId}
  //   </Tooltip>
  // );
};

export default ChatAvatar;
