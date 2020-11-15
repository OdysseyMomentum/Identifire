export interface EmergencyNotification {
  title: string;
  credentialTypes: string[];
  latitude: number;
  longitude: number;
  eventId: number;
  address: string;
}
