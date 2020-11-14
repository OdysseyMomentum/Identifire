import * as Location from 'expo-location';

export async function getLocation() {
  await Location.requestPermissionsAsync();

  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.LocationAccuracy.Low,
  });

  return location;
}

export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = 0.0421;

export interface LocationType {
  latitude: number;
  longitude: number;
}
