import React from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

export default ({
  messages,
  onSend,
  userId,
}: {
  messages: IMessage[];
  onSend: (messages: IMessage[]) => void;
  userId: number;
}) => {
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: userId,
      }}
    />
  );
};
