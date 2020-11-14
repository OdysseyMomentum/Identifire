export namespace WebSocket {
  export type Action =
    | {
        type: 'mobile->server/accept-event';
        payload: {
          eventId: string;
          userId: string;
          credentials: Credential[];
        };
      }
    | {
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
    | {
        type: 'dispatch->server/subscribe-to-event';
        payload: {
          eventId: string;
        };
      }
    | {
        type: 'mobile<->dispatch/chat';
        payload: {
          content: string;
        };
      };
}
