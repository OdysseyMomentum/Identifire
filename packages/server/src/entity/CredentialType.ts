import {Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToMany} from "typeorm";
import { EmergencyEventType } from "./EmergencyEventType";


@Entity()
@Unique(['name'])
export class CredentialType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: "BHV" | "CPR";
}