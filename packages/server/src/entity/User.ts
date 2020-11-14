import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { H3Index } from "h3-js";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  notificationId: number

  @Column({ nullable: true })
  locationIndex?: H3Index

  @Column({ nullable: true })
  latitude?: number

  @Column({ nullable: true })
  longitude?: number
}