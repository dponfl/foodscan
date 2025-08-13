import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAiClient } from '../../types';

@Injectable()
export class OpenAiClientFactory {
  private readonly logger = new Logger(OpenAiClientFactory.name);

  // Кеш для хранения созданных клиентов (синглтонов)
  private clients: Map<OpenAiClient, OpenAI> = new Map();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Возвращает экземпляр клиента OpenAI по его типу.
   * Создает и кеширует клиент при первом обращении.
   * @param clientType - Тип клиента из enum OpenAiClient
   * @returns сконфигурированный экземпляр OpenAI
   */
  public getClient(clientType: OpenAiClient): OpenAI {
    // 1. Проверяем кеш
    if (this.clients.has(clientType)) {
      const cachedClient = this.clients.get(clientType); // eslint-disable-line
      if (!cachedClient) {
        this.logger.error(
          `OpenAI client not found in cache for OpenAI client: ${clientType}`,
        );
      } else {
        return cachedClient;
      }
    }

    // 2. Получаем API ключ из .env
    const apiKey = this.configService.get<string>(
      `OPENAI_API_KEY_${clientType}`,
    );

    if (!apiKey) {
      this.logger.error(`API key for ${clientType} not found.`);
      throw new UnprocessableEntityException(
        `Configuration missing for OpenAI client: ${clientType}`,
      );
    }

    // 3. Создаем новый экземпляр
    const newClient = new OpenAI({
      apiKey: apiKey,
      maxRetries: 3,
      timeout: 60 * 1000,
    });

    this.logger.log(`Created OpenAI client for: ${clientType}`);

    // 4. Кешируем и возвращаем
    this.clients.set(clientType, newClient);
    return newClient;
  }
}
