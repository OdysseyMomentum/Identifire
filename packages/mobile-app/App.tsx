import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, LogBox } from 'react-native';
import { Subscription } from '@unimodules/core';
import AsyncStorage from '@react-native-community/async-storage';
import * as Notifications from 'expo-notifications';

import { EmergencyNotification } from 'common-types';
import EmergencyScreen from './src/screens/EmergencyScreen';
import { getLocation, LocationType } from './src/util/location';
import { onboard, updateUserLocation } from './src/util/api';
import { registerForPushNotificationsAsync } from './src/util/notification';

LogBox.ignoreAllLogs(true);

function Home() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>🔥</Text>
    </View>
  );
}

export default () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const responseListener = useRef<Subscription>();
  const notificationListener = useRef<Subscription>();
  const [emergencyNotification, setEmergencyNotification] = useState<
    EmergencyNotification | undefined
  >();
  const [userId, setUserId] = useState<undefined | number>();
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
    if (userId && location) {
      console.log('sending my location to ze zerver');
      updateUserLocation({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [userId, location]);

  useEffect(() => {
    async function onboardUser() {
      const userId = await AsyncStorage.getItem('userId-2');

      if (!userId || true) {
        const userId = await onboard(expoPushToken!);
        console.log('onboarding complete, got userId:', userId);
        await AsyncStorage.setItem('userId-2', String(userId));
        setUserId(userId);
      } else {
        // console.log('retrieved userId from storage:', userId);
        // setUserId(Number(userId));
      }
    }

    if (expoPushToken && !userId) {
      onboardUser();
    }
  }, [expoPushToken]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('got response');
        const emergency = (response.notification.request.content
          .data as unknown) as EmergencyNotification;

        setEmergencyNotification(emergency);
      }
    );

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('got notification');

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

  if (emergencyNotification && location.latitude !== 0 && userId) {
    return (
      <EmergencyScreen
        emergencyNotification={emergencyNotification}
        currentLocation={location}
        userId={userId}
      />
    );
  }

  return <Home />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
