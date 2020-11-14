export namespace RestAPI {
  export namespace User {
    export interface OnboardRequest {
      notificationToken: string;
    }
    export interface OnboardResponse {
      userId: string;
    }

    export interface LocationUpdateRequest {
      locationIndex: string;
      userId: string;
    }
  }

  export namespace Dispatch {
    export type EventType = 'fire' | 'heart-attack';

    export interface CreateEventRequest {
      latitude: number;
      longitude: number;
      type: EventType;
      nrOfParticipants: number;
    }
    export interface CreateEventResponse {
      address: string;
      id: number;
      latitude: number;
      longitude: number;
      nrOfParticipants: number;
      type: EventType;
    }

    export interface GetEventResponse {
      id: string;
      latitude: number;
      longitude: number;
      address: string;
    }
  }
}
