import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { H3Index } from "h3-js";
import { Socket } from "socket.io";
import { EmergencyEvent } from "./EmergencyEvent";
import { CredentialType } from "./CredentialType";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  notificationId: number

  @Column({ nullable: true })
  locationIndex?: H3Index

  @Column({ nullable: true })
  latitude: number

  @Column({ nullable: true })
  longitude: number

  @ManyToMany(() => CredentialType)
  @JoinTable()
  credentialTypes: CredentialType[]

  webSocketConnection?: Socket

  @ManyToOne(() => EmergencyEvent, emergency => emergency.users)
  activeEmergencyEvent?: EmergencyEvent
}