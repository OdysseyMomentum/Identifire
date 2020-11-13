export namespace RestAPI {
  export namespace User {
    export interface OnBoardRequest {
      notificationId: string;
    }

    export interface HackLocationUpdate {
        locationIndex: string;
        userId: string;
    }
  }

  export namespace Dispatch {
    export interface CreateEvent {
      location: {
        latitude: number;
        longitude: number;
      },
      /**
       * Range in meters
       */
      maxRange: number
    }
  }
}
