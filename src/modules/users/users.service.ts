import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/index';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  /**
   * Находит пользователя по Telegram ID (clientId) или создает нового, если он не найден.
   * @param data - Данные пользователя из Telegram.
   * @returns {Promise<User>} - Найденный или созданный пользователь.
   */
  async findOrCreate(data: CreateUserDto): Promise<User> {
    try {
      // 1. Ищем пользователя по уникальному clientId
      const existingUser = await this.userRepository.findOneBy({
        clientId: data.clientId,
      });

      // 2. Если нашли, возвращаем его
      if (existingUser) {
        return existingUser;
      }

      // 3. Если не нашли, создаем новую запись
      this.logger.log(`Creating a new user for clientId: ${data.clientId}`);
      const newUser = this.userRepository.create({
        clientId: data.clientId,
        userName: data.userName,
        userNick: data.userNick,
        lang: data.lang,
        // balance будет установлен по умолчанию (0), как указано в entity
      });

      // 4. Сохраняем и возвращаем нового пользователя
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(
        `Error in findOrCreate for clientId ${data.clientId}`,
        error.stack,
      );
      throw error;
    }
  }
}
