import { RestAPI } from 'common-types';
import axios from 'axios';

export const createAPI = ({ baseUrl }: { baseUrl: string }) => ({
  dispatchEvent: {
    async create(
      body: RestAPI.Dispatch.CreateEventRequest
    ): Promise<RestAPI.Dispatch.CreateEventResponse> {
      const { data } = await axios.post(baseUrl + '/event', body);
      return data;
    },
    async get(id: string): Promise<RestAPI.Dispatch.GetEventResponse> {
      const { data } = await axios.get(baseUrl + `/event/${id}`);
      return data;
    },
  },
});
