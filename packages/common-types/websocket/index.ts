export namespace WebSocket {
  export interface AcceptEvent {
    type: 'mobile->server/accept-event';
    payload: {
      eventId: string;
      userId: number;
      credentials: Credential[];
    };
  }

  export interface UpdateLocation {
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

  export interface SubscribeToEvent {
    type: 'dispatch->server/subscribe-to-event';
    payload: {
      eventId: string;
    };
  }

  export interface Chat {
    type: 'mobile<->dispatch/chat';
    payload: {
      content: string;
    };
  }
  export type Action = AcceptEvent | UpdateLocation | SubscribeToEvent | Chat;
}
