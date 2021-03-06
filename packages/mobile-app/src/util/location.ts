import * as Location from 'expo-location';

export async function startBackgroundLocationTracking() {
  if (!(await Location.hasStartedLocationUpdatesAsync('hexagon-tracking'))) {
    await Location.startLocationUpdatesAsync('hexagon-tracking', {
      accuracy: Location.LocationAccuracy.Balanced,
    });
  }
}

export async function getLocation() {
  await Location.requestPermissionsAsync();

  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.LocationAccuracy.Low,
  });

  return location;
}

export async function watchLocation(callback: Location.LocationCallback) {
  return Location.watchPositionAsync(
    {
      accuracy: Location.LocationAccuracy.Highest,
      distanceInterval: 2,
    },
    callback
  );
}

export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = 0.0421;

export interface LocationType {
  latitude: number;
  longitude: number;
}
