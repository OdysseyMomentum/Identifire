import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { CredentialType } from "./CredentialType";
import { EmergencyEvent } from "./EmergencyEvent";

@Entity()
export class EmergencyEventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string

  @Column()
  title: string;

  @ManyToMany(() => CredentialType)
  @JoinTable()
  credentialTypes: CredentialType[]

  @OneToMany(() => EmergencyEvent, emergency => emergency.emergencyType)
  emergencyEvents: EmergencyEvent[]
}