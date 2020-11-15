export namespace RestAPI {
  export namespace User {
    export interface OnboardRequest {
      notificationId: string;
    }
    export interface OnboardResponse {
      userId: number;
    }

    export interface LocationUpdateRequest {
      locationIndex: string;
      userId: string;
    }
  }

  export namespace Dispatch {
    export type EventType = 'Fire' | 'Heart Attack' | 'Cardiac Arrest';
    export type CredentialType = 'BHV' | 'CPR';

    export interface CreateEventRequest {
      latitude: number;
      longitude: number;
      type: EventType;
      nrOfParticipants: number;
      credentialType: CredentialType;
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
