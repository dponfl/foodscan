import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'client_id' }) // Имя колонки в БД для внешнего ключа
  client: User;

  @Column({ type: 'varchar' })
  subsCategory: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Для дробных чисел, идеально для денег
  amount: number;

  @Column({ type: 'varchar', length: 3 }) // Ограничение в 3 символа (напр., 'USD')
  currency: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'text' }) // 'text' подходит для длинных описаний
  paymentDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
