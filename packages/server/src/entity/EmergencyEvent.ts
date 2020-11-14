import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  testFunction(): void {
    console.log('something');
  }
}
