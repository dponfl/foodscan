import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  telegramId: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ default: 0 })
  balance: number;
}
