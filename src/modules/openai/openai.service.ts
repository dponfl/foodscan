import { Injectable, Logger } from '@nestjs/common';
import { OpenAiClientFactory } from './openai-client.factory';
import { ITelegramPhotoSize, OpenAiClient } from '../../types';
import { CommonService } from '../../helpers';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);

  constructor(
    private readonly clientFactory: OpenAiClientFactory,
    private readonly commonService: CommonService,
  ) {}

  async textCompletion(prompt: string): Promise<any> {
    const client = this.clientFactory.getClient(OpenAiClient.DEFAULT);
    const response = await client.responses.create({
      model: 'gpt-4-0125-preview',
      instructions: 'Отвечай языком высокообразованного человека',
      input: prompt,
    });
    return { status: 'Success', payload: response.output_text };
  }

  async handlePhoto(photoArray: ITelegramPhotoSize[]): Promise<any> {
    try {
      const base64Url =
        await this.commonService.getBase64UrlFromTelegramPhoto(photoArray);

      const client = this.clientFactory.getClient(OpenAiClient.DEFAULT);

      const response = await client.chat.completions.create({
        // model: 'gpt-4.1-mini',
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Что на этом изображении?' },
              {
                type: 'image_url',
                image_url: {
                  url: base64Url,
                },
              },
            ],
          },
        ],
      });

      const analysisResult = response.choices[0].message.content;

      this.logger.log(`Photo analysis result: ${analysisResult}`);

      return { status: 'Success', payload: analysisResult };
    } catch (error) {
      this.logger.error(`Error during photo analysis: ${error.message}`);
      return { status: 'Error', payload: error.message };
    }
  }

  /**
   * Имитирует анализ состава продукта.
   * В будущем здесь будет реальный запрос к OpenAI API.
   */
  async analyzeProductComposition(
    photo: any,
  ): Promise<{ status: 'Success' | 'Error'; payload: string }> {
    // Имитируем задержку ответа от API
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Имитируем случайный результат для демонстрации
    if (Math.random() > 0.2) {
      // 80% шанс на успех
      const examplePayload = `
        **❗️ E621 - Усилитель вкуса (глутамат натрия)**
        *Может вызывать:* головные боли, привыкание.
        *Не рекомендуется при:* мигренях, гипертонии.

        **✅ E330 - Лимонная кислота**
        *Безопасна* в малых дозах.
        *При избытке может раздражать ЖКТ.* Осторожно при гастрите.

        ---
        **Общие рекомендации:**
        - Не ешьте часто продукты с Е621.
        - После приёма рекомендуется обильное питьё и активированный уголь (2 таб.).
        - При проблемах с ЖКТ избегайте продуктов с кислотами и консервантами.
      `;
      return { status: 'Success', payload: examplePayload };
    } else {
      return { status: 'Error', payload: '' };
    }
  }
}
