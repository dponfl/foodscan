import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAiService {
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
