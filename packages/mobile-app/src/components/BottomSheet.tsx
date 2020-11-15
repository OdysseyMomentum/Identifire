import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// @ts-ignore
import { Block, Button } from 'galio-framework';
import BottomSheetBase from 'reanimated-bottom-sheet';
import Chat from './Chat';
import { IMessage } from 'react-native-gifted-chat';

export default ({
  title,
  //   eventType,
  distance,
  duration,
  address,
  onAccept,
  isAccepted,
  userId,
  onSend,
  messages,
}: {
  title: string;
  //   eventType: string;
  distance: number;
  duration: number;
  address: string;
  onAccept: () => void;
  isAccepted: boolean;
  userId: number;
  onSend: (messages: IMessage[]) => void;
  messages: IMessage[];
}) => {
  const bottomSheet = useRef(null);
  const durationText = `Travel time: ${Math.ceil(duration)} minutes`;
  const distanceText = `Distance: ${distance * 1000}m`;

  const renderInner = () => (
    <View style={styles.panel}>
      <Block style={styles.textContainer}>
        <Text style={styles.panelTitle}>{title}</Text>
        {/* <Text style={styles.panelSubtitle}>{eventType}</Text> */}
        <Text style={styles.panelSubtitle}>{distanceText}</Text>
        <Text style={styles.panelSubtitle}>{durationText}</Text>
        <Text style={styles.panelSubtitle}>Address: {address}</Text>
      </Block>
      {!isAccepted && (
        <Block row>
          <Button color="danger">Decline</Button>
          <Button color="success" onPress={onAccept}>
            Accept
          </Button>
        </Block>
      )}
      {isAccepted && (
        <Chat userId={userId} onSend={onSend} messages={messages} />
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <BottomSheetBase
      ref={bottomSheet}
      snapPoints={[425]}
      renderContent={renderInner}
      renderHeader={renderHeader}
      enabledInnerScrolling={false}
      enabledBottomClamp={true}
    />
  );
};

const styles = StyleSheet.create({
  panel: {
    height: 400,
    padding: 10,
    backgroundColor: '#f7f5eee8',
  },
  textContainer: {
    marginHorizontal: 8,
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    marginBottom: 5,
  },
  panelSubtitle: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 2,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
