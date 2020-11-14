import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// @ts-ignore
import { Block, Button } from 'galio-framework';
import BottomSheetBase from 'reanimated-bottom-sheet';

export default ({
  title,
  //   eventType,
  distance,
  duration,
  onAccept,
}: {
  title: string;
  //   eventType: string;
  distance: number;
  duration: number;
  onAccept: () => void;
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
      </Block>
      <Block row>
        <Button backgroundColor color="danger">
          Decline
        </Button>
        <Button color="success">Accept</Button>
      </Block>
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
      snapPoints={[400]}
      renderContent={renderInner}
      renderHeader={renderHeader}
      enabledInnerScrolling={false}
      enabledBottomClamp={true}
    />
  );
};
