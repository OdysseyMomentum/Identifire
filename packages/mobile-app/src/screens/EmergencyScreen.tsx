import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { IMessage } from 'react-native-gifted-chat';

import { GOOGLE_MAPS_API_KEY } from '@env';
import { EmergencyNotification } from 'common-types';
import {
  LATITUDE_DELTA,
  LocationType,
  LONGITUDE_DELTA,
  watchLocation,
} from '../util/location';
import BottomSheet from '../components/BottomSheet';
import {
  acceptEvent,
  getSocket,
  sendChat,
  updateLocation,
} from '../util/websocket';

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
  const [messages, setMessages] = useState<IMessage[]>([
    {
      text: 'hello',
      createdAt: new Date(),
      _id: Math.random(),
      user: {
        _id: userId,
      },
    },
  ]);
  const [isAccepted, setIsAccepted] = useState(false);
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
      console.log('accepting event');
      const socket = await getSocket();
      setSocket(socket);

      socket.on('message', (event: any) => {
        console.log('message', event);
      });

      await acceptEvent(socket, {
        credentials: [{ type: 'BHV', name: 'Timo Glastra' }],
        eventId: emergencyNotification.eventId,
        userId,
      });

      setIsAccepted(true);

      setLocationWatcher(
        await watchLocation((location) => {
          console.log('got location', location);
          updateLocation(socket, {
            userId,
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        })
      );
    }

    accept();
  };

  function onSend(messages: IMessage[]) {
    console.log('sending chat message', messages[0].text);
    sendChat(socket!, {
      content: messages[0].text,
    });
  }

  return (
    <View style={styles.container}>
      <BottomSheet
        onAccept={onAccept}
        distance={directionsInfo.distance}
        duration={directionsInfo.duration}
        title={emergencyNotification.title}
        address={emergencyNotification.address}
        isAccepted={isAccepted}
        userId={userId}
        onSend={onSend}
        messages={messages}
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
