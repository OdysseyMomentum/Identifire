import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { H3Index } from "h3-js";
import { Socket } from "socket.io";
import { EmergencyEvent } from "./EmergencyEvent";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  notificationId: number

  @Column({ nullable: true })
  locationIndex?: H3Index

  webSocketConnection?: Socket

  @ManyToOne(() => EmergencyEvent, emergency => emergency.users)
  activeEmergencyEvent?: EmergencyEvent
}