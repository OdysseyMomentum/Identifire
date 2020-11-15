// @ts-ignore
import { geoToH3 } from 'h3-reactnative';
import { HTTP_URL } from '@env';
import { RestAPI } from 'common-types';
import { LocationType } from './location';

export async function post(
  path: string,
  data: any,
  responseRequested = true,
  method = 'POST'
) {
  const url = `${HTTP_URL}${path}`;
  console.log('sending request', url, data);
  const response = await fetch(`${HTTP_URL}${path}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (responseRequested) {
    return response.json();
  }
}

export async function onboard(notificationId: string): Promise<number> {
  const data: RestAPI.User.OnboardRequest = {
    notificationId,
  };

  try {
    const { userId }: RestAPI.User.OnboardResponse = await post(
      '/user/onboard',
      data
    );

    return userId;
  } catch (e) {
    throw e;
  }
}

export async function updateUserLocation({
  latitude,
  longitude,
  userId,
}: LocationType & { userId: number }) {
  const h3Index = geoToH3(latitude, longitude, 5);
  await post(
    '/user/location',
    {
      locationIndex: h3Index,
      userId,
    },
    false,
    'PUT'
  );
}
