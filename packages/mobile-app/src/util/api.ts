// @ts-ignore
import { geoToH3 } from 'h3-reactnative';
import { HTTP_URL } from '@env';
import { RestAPI } from 'common-types';
import { LocationType } from './location';

export async function post(path: string, data: any) {
  const response = await fetch(`${HTTP_URL}${path}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function onboard(notificationToken: string): Promise<string> {
  const data: RestAPI.User.OnboardRequest = {
    notificationToken,
  };
  const { userId }: RestAPI.User.OnboardResponse = await post(
    '/user/onboard',
    data
  );

  return userId;
}

export async function updateUserLocation({
  latitude,
  longitude,
  userId,
}: LocationType & { userId: string }) {
  const h3Index = geoToH3(latitude, longitude, 7);
  post('/user/location', {
    locationIndex: h3Index,
    userId,
  });
}
