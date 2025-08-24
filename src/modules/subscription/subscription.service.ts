import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User, UsersService } from '../users';
import {
  ISubscription,
  ITelegramSuccessfulPayment,
  PAYMENT_SUBSCRIPTION_CATEGORY,
} from '../../types';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly usersService: UsersService) {}

  async isActive(clientId: number): Promise<boolean> {
    const user = await this.usersService.findByClientId(clientId);

    // 1. Если пользователь не найден, у него нет доступа.
    if (!user) {
      this.logger.warn(`User with clientId ${clientId} not found.`);
      return false;
    }

    // 2. Проверяем наличие бесплатных или платных проверок.
    if (user.freeChecks > 0 || user.paidChecks > 0) {
      return true;
    }

    // 3. Проверяем, есть ли активная подписка по дате.
    // Убеждаемся, что поле не null и дата в будущем.
    if (user.subscriptionUntil && user.subscriptionUntil > new Date()) {
      return true;
    }

    // 4. Если ни одно из условий не выполнено, возвращаем false.
    return false;
  }

  /**
   * Декрементирует счётчик проверок при запросе.
   * Сначала списываются бесплатные (freeChecks), затем платные (paidChecks).
   * @param clientId - Telegram ID пользователя.
   * @returns {Promise<User>} - Обновлённая сущность пользователя.
   */
  async updateOnCheckRequest(clientId: number): Promise<User> {
    const user = await this.usersService.findByClientId(clientId);

    if (!user) {
      this.logger.error(
        `User with clientId: ${clientId} not found for check request.`,
      );
      throw new ForbiddenException(
        `User with clientId: ${clientId} not found for check request.`,
      );
    }

    if (user.freeChecks > 0) {
      user.freeChecks -= 1;
      this.logger.log(
        `Decremented free check for clientId: ${clientId}. Remaining: ${user.freeChecks}`,
      );
    } else if (user.paidChecks > 0) {
      user.paidChecks -= 1;
      this.logger.log(
        `Decremented paid check for clientId: ${clientId}. Remaining: ${user.paidChecks}`,
      );
    }

    return this.usersService.save(user);
  }

  /**
   * Обновляет сущность пользователя после успешного платежа.
   * @param clientId - Telegram ID пользователя.
   * @param successfulPayment - Объект успешного платежа.
   * @returns {Promise<User>} - Обновлённая сущность пользователя.
   */
  async updateOnSuccessfulPayment(
    clientId: number,
    successfulPayment: ITelegramSuccessfulPayment,
  ): Promise<User> {
    const user = await this.usersService.findByClientId(clientId);

    if (!user) {
      this.logger.error(
        `User with clientId: ${clientId} not found during successful payment update.`,
      );
      throw new NotFoundException(
        `User with clientId: ${clientId} not found during successful payment update.`,
      );
    }

    const subsCategory =
      successfulPayment.invoice_payload as PAYMENT_SUBSCRIPTION_CATEGORY;

    // Проверяем, что полученная категория существует в нашем enum
    if (!Object.values(PAYMENT_SUBSCRIPTION_CATEGORY).includes(subsCategory)) {
      this.logger.error(
        `Invalid subsCategory: '${subsCategory}' for clientId: ${clientId} received in payload.`,
      );
      throw new BadRequestException(
        `Invalid subsCategory: '${subsCategory}' for clientId: ${clientId} received in payload.`,
      );
    }

    switch (subsCategory) {
      case PAYMENT_SUBSCRIPTION_CATEGORY.ONE_TIME:
        user.paidChecks += 1;
        break;

      case PAYMENT_SUBSCRIPTION_CATEGORY.TEN_TIMES:
        user.paidChecks += 10;
        break;

      case PAYMENT_SUBSCRIPTION_CATEGORY.ONE_MONTH:
        const nowMonth = new Date();
        const baseDateMonth =
          user.subscriptionUntil && user.subscriptionUntil > nowMonth
            ? user.subscriptionUntil
            : nowMonth;
        const newSubDateMonth = new Date(baseDateMonth);
        newSubDateMonth.setMonth(newSubDateMonth.getMonth() + 1);
        user.subscriptionUntil = newSubDateMonth;
        break;

      case PAYMENT_SUBSCRIPTION_CATEGORY.ONE_YEAR:
        const nowYear = new Date();
        const baseDateYear =
          user.subscriptionUntil && user.subscriptionUntil > nowYear
            ? user.subscriptionUntil
            : nowYear;
        const newSubDateYear = new Date(baseDateYear);
        newSubDateYear.setFullYear(newSubDateYear.getFullYear() + 1);
        user.subscriptionUntil = newSubDateYear;
        break;
    }

    this.logger.log(
      `Updating user ${user.id} for clientId: ${clientId} with new checks/subscription. Category: ${subsCategory}`,
    );

    return this.usersService.save(user);
  }

  /**
   * Возвращает текущий статус подписки и количество проверок пользователя.
   * @param clientId - Telegram ID пользователя.
   * @returns {Promise<ISubscription>} - Объект со статусом подписки.
   */
  async getStatus(clientId: number): Promise<ISubscription> {
    const user = await this.usersService.findByClientId(clientId);

    if (!user) {
      this.logger.warn(
        `Subscription status requested for non-existent user with clientId: ${clientId}`,
      );
      throw new NotFoundException(
        `Subscription status requested for non-existent user with clientId: ${clientId}`,
      );
    }

    const { freeChecks, paidChecks, subscriptionUntil } = user;

    return {
      freeChecks,
      paidChecks,
      subscriptionUntil,
    };
  }
}
