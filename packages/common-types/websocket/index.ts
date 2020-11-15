import { Credential } from '..';

export namespace WebSocket {
  export interface AcceptEvent {
    type: 'mobile->server/accept-event';
    payload: {
      eventId: number;
      userId: number;
      credentials: Credential[];
    };
  }

  export interface ServerUpdateLocation {
    type: 'server->dispatch/participant-location-update';
    payload: {
      users: Array<{
        id: number;
        location: {
          latitude: number;
          longitude: number;
        };
      }>;
    };
  }

  export interface MobileUpdateLocation {
    type: 'mobile->dispatch/participant-location-update';
    payload: {
      userId: number;
      location: {
        latitude: number;
        longitude: number;
      };
    };
  }

  export interface SubscribeToEvent {
    type: 'dispatch->server/subscribe-to-event';
    payload: {
      eventId: number;
    };
  }

  export interface Chat {
    type: 'mobile<->dispatch/chat';
    payload: {
      name: string;
      userId: number;
      content: string;
      eventId: number;
      avatarUrl: string;
    };
  }

  export interface EndEmergency {
    type: 'dispatch->server/end-emergency-event';
    payload: {
      eventId: string;
    };
  }

  export type Action =
    | AcceptEvent
    | SubscribeToEvent
    | MobileUpdateLocation
    | ServerUpdateLocation
    | Chat
    | EndEmergency;
}
