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
} from '../util/location';
import BottomSheet from '../components/BottomSheet';

interface DirectionsInfo {
  distance: number;
  duration: number;
}

export default ({
  emergencyNotification,
  currentLocation,
}: {
  emergencyNotification: EmergencyNotification;
  currentLocation: LocationType;
}) => {
  const [directionsInfo, setDirectionsInfo] = useState<DirectionsInfo>({
    distance: 0,
    duration: 0,
  });

  const emergencyLocation: LocationType = {
    latitude: emergencyNotification.latitude,
    longitude: emergencyNotification.longitude,
  };

  const onAccept = () => {};

  return (
    <View style={styles.container}>
      <BottomSheet
        onAccept={onAccept}
        distance={directionsInfo.distance}
        duration={directionsInfo.duration}
        title={emergencyNotification.title}
      />
      <MapView
        style={styles.mapStyle}
        region={{
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
          ...currentLocation,
        }}
        showsUserLocation={true}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
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
