import React, { RefObject, useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Subscription } from '@unimodules/core';
import MapViewDirections from 'react-native-maps-directions';
// @ts-ignore
import { Button, Block } from 'galio-framework';
import BottomSheet from 'reanimated-bottom-sheet';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0421;
const emergencyLocation = {
  latitude: 52.094129,
  longitude: 5.118801,
};

export default () => {
  const [region, setRegion] = useState({
    latitude: 52.09538,
    longitude: 5.12971,
    latitudeDelta,
    longitudeDelta,
  });
  const bottomSheet = useRef(null);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const [location, setLocation] = useState<
    { latitude: number; longitude: number } | undefined
  >();

  const [directionsInfo, setDirectionsInfo] = useState<
    { distance: number; duration: number } | undefined
  >();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        console.log(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener as any);
      Notifications.removeNotificationSubscription(responseListener as any);
    };
  }, []);

  useEffect(() => {
    async function getLocation() {
      await Location.requestPermissionsAsync();

      let _location = await Location.getCurrentPositionAsync({
        accuracy: Location.LocationAccuracy.Low,
      });
      setRegion((region) => ({
        ...region,
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
      }));

      setLocation({
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
      });
    }

    getLocation();
  }, []);

  const renderInner = () => (
    <View style={styles.panel}>
      <Block style={{ marginHorizontal: 8 }}>
        <Text style={styles.panelTitle}>Emergency event</Text>
        <Text style={styles.panelSubtitle}>Event type: Fire</Text>
        <Text style={styles.panelSubtitle}>
          Approx. distance:{' '}
          {directionsInfo?.distance
            ? directionsInfo?.distance * 1000 + 'm'
            : '800m'}
        </Text>
        <Text style={styles.panelSubtitle}>
          Approx. travel time:{' '}
          {directionsInfo?.duration
            ? Math.ceil(directionsInfo?.duration) + 'm'
            : '2m'}
        </Text>
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
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheet}
        snapPoints={[300, 450]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        enabledInnerScrolling={false}
        enabledBottomClamp={true}

        // initialSnap={0}
      />
      <MapView
        style={styles.mapStyle}
        region={region}
        showsUserLocation={true}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
      >
        <Marker coordinate={emergencyLocation} />
        <MapViewDirections
          onReady={setDirectionsInfo}
          origin={location}
          destination={emergencyLocation}
          apikey=""
        />
      </MapView>
    </View>
  );
};

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  panel: {
    height: 400,
    padding: 10,
    backgroundColor: '#f7f5eee8',
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
  map: {
    height: '100%',
    width: '100%',
  },
});
