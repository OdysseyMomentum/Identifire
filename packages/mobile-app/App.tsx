import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Subscription } from '@unimodules/core';

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import EmergencyScreen from './src/screens/EmergencyScreen';
import { EmergencyNotification } from 'common-types';
import { getLocation, LocationType } from './src/util/location';
import { onboard } from './src/util/api';

function Home() {
  return <View style={styles.container}></View>;
}

export default () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const responseListener = useRef<Subscription>();
  const notificationListener = useRef<Subscription>();
  const [emergencyNotification, setEmergencyNotification] = useState<
    EmergencyNotification | undefined
  >();
  const [location, setLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    getLocation().then((location) => {
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      onboard(expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const emergency = (response.notification.request.content
          .data as unknown) as EmergencyNotification;

        setEmergencyNotification(emergency);
      }
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const emergency = (notification.request.content
          .data as unknown) as EmergencyNotification;

        setEmergencyNotification(emergency);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(responseListener as any);
      Notifications.removeNotificationSubscription(notificationListener as any);
    };
  }, []);

  if (emergencyNotification && location.latitude !== 0) {
    return (
      <EmergencyScreen
        emergencyNotification={emergencyNotification}
        currentLocation={location}
      />
    );
  }

  return <Home />;
};

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

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
