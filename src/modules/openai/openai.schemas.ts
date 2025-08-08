import { z } from 'zod';

// Схема для проверки контекста изображения
export const photoContextSchema = z.object({
  isContextCorrect: z
    .boolean()
    .describe(
      'true, если на фото есть четкий состав продукта. false, если это что-то другое.',
    ),
  contextExplanation: z
    .string()
    .describe(
      'Краткое объяснение на 1-2 предложения, что на фото, если isContextCorrect=false. Например: "На фото изображен пейзаж", "На фото чек из магазина". Формат MarkdownV2 в нотации Telegram.',
    ),
});

// Схема для одного блока анализа в составе
export const compositionAnalysisChunkSchema = z.object({
  explanation: z
    .string()
    .describe(
      'Анализ одного ингредиента или группы. Например: "❗️E621 — усилитель вкуса (глутамат натрия)\\n— Может вызывать: головные боли, привыкание\\n— Не рекомендуется при: мигренях, гипертонии". Формат MarkdownV2 в нотации Telegram.',
    ),
});

// Финальная, полная схема для ответа
export const fullCompositionAnalysisSchema = z.object({
  photoCheck: photoContextSchema.describe(
    'Первичная проверка содержимого фото.',
  ),
  compositionAnalysisDetails: z
    .array(compositionAnalysisChunkSchema)
    .describe(
      'Массив с детальным разбором каждого вредного или значимого ингредиента. Пустой массив, если состав полностью безопасен или photoCheck.isContextCorrect=false.',
    ),
  compositionAnalysisResult: z
    .string()
    .describe(
      'Полный, готовый для отправки в Telegram отчет в формате MarkdownV2 в нотации Telegram, включающий общие рекомендации и вывод нутрициолога. Если photoCheck.isContextCorrect=false, это поле должно быть пустой строкой.',
    ),
});

export type FullCompositionAnalysis = z.infer<
  typeof fullCompositionAnalysisSchema
>;
