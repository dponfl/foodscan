import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  clientId: number;

  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  userNick?: string;

  @Column({ default: 'ru' })
  lang: string;

  @Column({ default: 3 })
  freeChecks: number;

  @Column({ default: 0 })
  paidChecks: number;

  @Column({ nullable: true, type: 'timestamp' })
  subscriptionUntil: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.client)
  payments: Payment[];
}
