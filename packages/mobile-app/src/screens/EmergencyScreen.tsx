import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { GOOGLE_MAPS_API_KEY } from '@env';
import { EmergencyNotification } from 'common-types';
import {
  LATITUDE_DELTA,
  LocationType,
  LONGITUDE_DELTA,
  watchLocation,
} from '../util/location';
import BottomSheet from '../components/BottomSheet';
import { acceptEvent, getSocket } from '../util/websocket';

interface DirectionsInfo {
  distance: number;
  duration: number;
}

export default ({
  emergencyNotification,
  currentLocation,
  userId,
}: {
  emergencyNotification: EmergencyNotification;
  currentLocation: LocationType;
  userId: number;
}) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>();
  const [directionsInfo, setDirectionsInfo] = useState<DirectionsInfo>({
    distance: 0,
    duration: 0,
  });
  const [locationWatcher, setLocationWatcher] = useState<
    | {
        remove(): void;
      }
    | undefined
  >();

  const emergencyLocation: LocationType = {
    latitude: emergencyNotification.latitude,
    longitude: emergencyNotification.longitude,
  };

  useEffect(() => {
    return () => {
      if (locationWatcher) {
        locationWatcher.remove();
      }
    };
  }, []);

  const onAccept = () => {
    async function accept() {
      const socket = await getSocket();
      setSocket(socket);

      socket.on('message', (event: any) => {
        console.log('message', event);
      });

      await acceptEvent(socket, {
        credentials: [],
        eventId: emergencyNotification.id,
        userId,
      });

      setLocationWatcher(await watchLocation(() => {}));
    }

    accept();
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        onAccept={onAccept}
        distance={directionsInfo.distance}
        duration={directionsInfo.duration}
        title={emergencyNotification.title}
        address={emergencyNotification.address}
      />
      <MapView
        style={styles.mapStyle}
        region={{
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
          ...currentLocation,
        }}
        showsUserLocation={true}
        // pitchEnabled={false}
        // rotateEnabled={false}
        // scrollEnabled={false}
      >
        <Marker coordinate={emergencyLocation} />
        <MapViewDirections
          mode="WALKING"
          onReady={setDirectionsInfo}
          origin={currentLocation}
          destination={emergencyLocation}
          apikey={GOOGLE_MAPS_API_KEY}
        />
      </MapView>
    </View>
  );
};

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
  map: {
    height: '100%',
    width: '100%',
  },
});
