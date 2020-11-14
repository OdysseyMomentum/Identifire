import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { CredentialType } from "./CredentialType";

@Entity()
export class EmergencyEventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => CredentialType)
  @JoinTable()
  credentialTypes: CredentialType[]
}