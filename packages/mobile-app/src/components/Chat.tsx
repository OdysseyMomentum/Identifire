import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
// @ts-ignore
import { Text, Button, Input, Block } from 'galio-framework';

import { WebSocket } from 'common-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default ({
  messages,
  onSend,
}: {
  messages: WebSocket.Chat[];
  onSend: (message: string) => void;
}) => {
  const [text, setText] = useState('');

  const send = () => {
    onSend(text);
    setText('');
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }: { item: WebSocket.Chat }) => (
          <Text key={item.payload.content} style={styles.item}>
            {item.payload.name}: {item.payload.content}
          </Text>
        )}
      />
      <Block row>
        <Input onChangeText={setText}></Input>
        <Button onPress={send}>Send</Button>
      </Block>
    </View>
  );
};
