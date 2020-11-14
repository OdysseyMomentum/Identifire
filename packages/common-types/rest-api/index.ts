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
    export interface CreateEventRequest {
      latitude: number;
      longitude: number;
      type: 'fire' | 'heart-attack';
      nrOfParticipants: number;
    }
    export interface CreateEventResponse {}

    export interface GetEventResponse {
      id: string;
      latitude: number;
      longitude: number;
    }
  }
}
