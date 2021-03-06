import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EmergencyEventType } from './EmergencyEventType';
import { User } from './User';

@Entity()
export class EmergencyEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  address: string;

  @ManyToOne(
    () => EmergencyEventType,
    (emergencyEventType) => emergencyEventType.emergencyEvents,
    { eager: true }
  )
  emergencyType: EmergencyEventType;

  @OneToMany(() => User, (user) => user.activeEmergencyEvent, { eager: true })
  users: User[];
}
