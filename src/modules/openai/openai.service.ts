import { Injectable, Logger } from '@nestjs/common';
import { OpenAiClientFactory } from './openai-client.factory';
import { ITelegramPhotoSize, OpenAiClient } from '../../types';
import { CommonService } from '../../helpers';
import z from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import { prompts } from './openai.prompts';
import {
  FullCompositionAnalysis,
  fullCompositionAnalysisSchema,
} from './openai.schemas';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly TELEGRAM_MESSAGE_LIMIT = 4096;

  constructor(
    private readonly clientFactory: OpenAiClientFactory,
    private readonly commonService: CommonService,
  ) {}

  /**
   * Разбивает сообщение для Telegram, уважая лимит символов и целостность строк.
   * @param message Исходный текст.
   * @returns Массив сообщений.
   */
  private splitMessageForTelegram(message: string): string[] {
    if (message.length <= this.TELEGRAM_MESSAGE_LIMIT) {
      return [message];
    }

    const chunks: string[] = [];
    let currentChunk = '';
    // Разбиваем по переносу строки, чтобы не резать предложения
    const lines = message.split('\n');

    for (const line of lines) {
      // Если добавление новой строки превысит лимит
      if (currentChunk.length + line.length + 1 > this.TELEGRAM_MESSAGE_LIMIT) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      currentChunk += line + '\n';
    }

    // Добавляем последний оставшийся кусок
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

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

  async handleStructuredOutputsForText(input: string): Promise<any> {
    const client = this.clientFactory.getClient(OpenAiClient.DEFAULT);

    const step = z.object({
      explanation: z.string(),
      output: z.string(),
    });

    const mathResponse = z.object({
      steps: z.array(step),
      final_answer: z.string(),
    });

    try {
      const response = await client.responses.parse({
        input,
        model: 'gpt-4o',
        text: {
          format: zodTextFormat(mathResponse, 'math_response'),
        },
      });

      this.logger.log(`Steps output: ${response.output_parsed}`);
      this.logger.log(
        `Final response: ${response.output_parsed?.final_answer}`,
      );
      return { status: 'Success', payload: response.output_parsed };
    } catch (error) {
      this.logger.error(`Error during math response: ${error.message}`);
      return { status: 'Failed', payload: error.message };
    }
  }

  /**
   * Анализирует изображение состава продукта с использованием Structured Outputs.
   */
  async analyzeProductImage(
    photoArray: ITelegramPhotoSize[],
  ): Promise<{ status: 'Success' | 'Failed' | 'Error'; payload: any }> {
    try {
      this.logger.log('Starting product image analysis...');

      const base64Url =
        await this.commonService.getBase64UrlFromTelegramPhoto(photoArray);

      const client = this.clientFactory.getClient(OpenAiClient.DEFAULT);

      const response = await client.responses.parse({
        model: 'gpt-4o',
        input: [
          {
            role: 'system',
            content: prompts.system,
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompts.user,
              },
              {
                type: 'input_image',
                image_url: base64Url,
                detail: 'high',
              },
            ],
          },
        ],
        text: {
          format: zodTextFormat(
            fullCompositionAnalysisSchema,
            'CompositionAnalysis',
          ),
        },
        temperature: 0.2, // Низкая температура для более предсказуемого результата
      });

      // console.log(`response: ${JSON.stringify(response)}`);

      const analysis: FullCompositionAnalysis =
        response.output_parsed as FullCompositionAnalysis;

      this.logger.log('Received structured response from OpenAI.');

      // Этап 1: Проверяем, правильный ли контекст
      if (!analysis.photoCheck.isContextCorrect) {
        this.logger.warn(
          `Incorrect context. Reason: ${analysis.photoCheck.contextExplanation}`,
        );
        return { status: 'Failed', payload: analysis.photoCheck };
      }

      let fullMsg = `🔎 Разбор состава:\n\n`;

      for (const step of analysis.compositionAnalysisDetails) {
        fullMsg += `${step.explanation}\n\n`;
      }

      fullMsg += `\n👉 ${analysis.compositionAnalysisResult}`;

      fullMsg += `\n\n❤️ Заботься о себе — ты то, что ты ешь!`;

      this.logger.log(`Full message: ${fullMsg}`);

      // Этап 2: Контекст верен, возвращаем полный анализ
      // Разбиваем финальное сообщение на части для Telegram
      const messageChunks = this.splitMessageForTelegram(fullMsg);

      this.logger.log(
        `Message chunks for Telegram: ${JSON.stringify(messageChunks)}`,
      );

      this.logger.log('Analysis successful. Report is ready.');

      return {
        status: 'Success',
        payload: { messageChunks },
      };
    } catch (error) {
      this.logger.error(`Error during structured analysis: ${error.stack}`);
      // Обработка ошибок от OpenAI, например, если JSON не валиден
      if (error instanceof OpenAI.APIError) {
        return { status: 'Error', payload: error.message };
      }
      return { status: 'Error', payload: 'An unknown error occurred.' };
    }
  }

  /**
   * Имитирует анализ состава продукта.
   * В будущем здесь будет реальный запрос к OpenAI API.
   */
  async mockAnalyzeProductComposition(
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
