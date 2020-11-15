import { Expo } from 'expo-server-sdk';
import { EmergencyEvent } from './entity/EmergencyEvent';
import { User } from './entity/User';

export class NotificationService {
  expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendNotification(emergency: EmergencyEvent, users: User[]) {
    console.log('send noti with emergency', emergency, users);

    let messages = [];
    console.log(`Sending notifications to ${users.length} users`);
    for (const user of users) {
      messages.push({
        to: user.notificationId,
        sound: 'default',
        body: 'Your help is requested!',
        data: {
          eventId: emergency.id,
          title: emergency.emergencyType.title,
          // TODO: well, sorta actually enable this and stuff
          // credentialTypes: emergency.emergencyType.credentialTypes.map(
          //   (x) => x.name
          // ),
          credentialTypes: [],
          latitude: emergency.latitude,
          longitude: emergency.longitude,
        },
      });
    }
    let chunks = this.expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      try {
        let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log('got chunk from sending notifications', ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
