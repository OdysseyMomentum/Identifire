import * as Location from 'expo-location';

export async function getLocation({
  accuracy = Location.LocationAccuracy.Low,
}: {
  accuracy: Location.LocationAccuracy;
}) {
  await Location.requestPermissionsAsync();

  let location = await Location.getCurrentPositionAsync({
    accuracy,
  });

  return location;
}

export async function watchLocation(callback: Location.LocationCallback) {
  return Location.watchPositionAsync(
    {
      accuracy: Location.LocationAccuracy.BestForNavigation,
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
