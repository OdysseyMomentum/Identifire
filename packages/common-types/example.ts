import { RestAPI } from '.';

export const body: RestAPI.Dispatch.CreateEventRequest = {
  type: 'fire',
  nrOfParticipants: 10,
  latitude: 123,
  longitude: 123,
};
