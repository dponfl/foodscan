import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ default: 0 })
  balance: number;

  /**
   * TODO: Добавить поля:
   *  - freeChecks: количество бесплатных проверок
   *  - payedChecks: количество платных проверок
   *  - subscriptionUntil: дата окончания подписки
   */
}
