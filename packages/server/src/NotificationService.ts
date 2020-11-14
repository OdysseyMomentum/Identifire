import { Expo } from 'expo-server-sdk';
import { EmergencyEvent } from './entity/EmergencyEvent';
import { User } from './entity/User';

export class NotificationService {
  expo: Expo

  constructor() {
    this.expo = new Expo()
  }

  async sendNotification(emergency: EmergencyEvent, users: User[]) {
    let messages = []
    
    for (const user of users) {
      messages.push({
        to: user.notificationId,
        sound: 'default',
        body: 'Your help is requested!',
        data: {
          eventId: emergency.id,
          title: emergency.emergencyType.title,
          credentialTypes: emergency.emergencyType.credentialTypes.map(x => x.name),
          latitude: emergency.latitude,
          longitude: emergency.longitude
        }
      })
    }
    let chunks = this.expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      try {
        let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }


  }

}