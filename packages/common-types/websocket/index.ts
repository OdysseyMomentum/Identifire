export namespace WebSocket {
  export interface Action {
    type: string;
    payload: Record<string, unknown>;
  }

  export namespace User {
    export interface AcceptEventAction {
      type: 'accept-event';
      payload: {
        eventId: string;
        userId: string;
        credentials: Credential[];
      };
    }
  }

  export namespace Dispatch {}

  export interface ChatAction {
    type: 'chat';
    payload: {
      content: string;
    };
  }
}
