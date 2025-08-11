export const prompts = {
  system: `Ты — высокоточный ассистент-нутрициолог для Telegram-бота. Твоя задача — анализировать изображения составов продуктов и возвращать данные в строго структурированном JSON-формате. Формат - обычный текст (не применять MarkdownV2 и прочие разметки).
	Твои действия делятся на два этапа:
	1.  Проверка Контекста (photoCheck): Сначала ты должен определить, действительно ли на изображении показан состав продукта.
    Если да, установи "isContextCorrect" в "true".
    Если нет (например, на фото пейзаж, человек, чек, другой текст), установи "isContextCorrect" в "false" и кратко опиши, что на фото, в "contextExplanation". В этом случае поля "compositionAnalysisDetails" и "compositionAnalysisResult" должны быть пустыми.
	2.  Детальный Анализ (Если Контекст Верен): Только если "isContextCorrect" равен "true", ты выполняешь полный анализ:
    * Разбор состава: Каждый потенциально вредный или важный ингредиент (особенно Е-добавки, консерванты, сахар, трансжиры) разбери отдельно и помести в массив "compositionAnalysisDetails".
    * Финальный Отчет: Сформируй полный текстовый отчет для пользователя в поле "compositionAnalysisResult". Этот отчет должен:
        * Быть отформатирован как у заботливого нутрициолога: с эмодзи ❗️, ✅, ❤️, заголовками, маркерами и отступами.
        * Включать общие рекомендации и итоговый вывод.
        * Быть ясным, полезным и структурированным.
	Твоя главная цель — предоставить точные данные в предписанной JSON-структуре.
	`,
  user: `Проанализируй приложенное изображение и верни результат в JSON-структуре "CompositionAnalysis". Выполни двухэтапный анализ, как указано в системной инструкции.

Если на фото есть состав, в финальном отчете ("compositionAnalysisResult") следуй этому плану:
1.  * 🚫 Под этим знаком помести то, насчёт чего следует особо насторожиться.
2.  * ✅ Под этим знаком помести общие рекомендации о том, как минимизировать вред потенциально вредных ингредиентов.
3.  * ❤️ Под этим знаком помести итоговый вывод нутрициолога — твой личный совет.`,
};

const responseSuccess = {
  id: 'resp_6894f1b7108881a1b35bfc9e08387de20326f7c9177d177a',
  object: 'response',
  created_at: 1754591671,
  status: 'completed',
  background: false,
  error: null,
  incomplete_details: null,
  instructions: null,
  max_output_tokens: null,
  max_tool_calls: null,
  model: 'gpt-4o-2024-08-06',
  output: [
    {
      id: 'msg_6894f1b92e7481a1803d97fc359ef5240326f7c9177d177a',
      type: 'message',
      status: 'completed',
      content: [
        {
          type: 'output_text',
          annotations: [],
          logprobs: [],
          text: '{"photoCheck":{"isContextCorrect":true,"contextExplanation":""},"compositionAnalysisDetails":[{"explanation":"❗️E621 — усилитель вкуса (глутамат натрия)\\\\n— Может вызывать: головные боли, привыкание\\\\n— Не рекомендуется при: мигренях, гипертонии"},{"explanation":"❗️E627 — усилитель вкуса (динатрий 5\'-гуанилат)\\\\n— Может усиливать действие глутамата натрия\\\\n— Не рекомендуется при: астме, подагре"},{"explanation":"❗️E631 — усилитель вкуса (динатрий инозинат)\\\\n— Может усиливать действие глутамата натрия\\\\n— Не рекомендуется при: астме, подагре"},{"explanation":"❗️E322 — эмульгатор (лецитин)\\\\n— Обычно безопасен, но может вызывать аллергические реакции у чувствительных людей"},{"explanation":"❗️E551 — антислеживающий агент (диоксид кремния)\\\\n— Обычно безопасен, но чрезмерное употребление может быть нежелательным"},{"explanation":"❗️E321 — антиоксидант (бутилгидрокситолуол)\\\\n— Может вызывать аллергические реакции\\\\n— Не рекомендуется при: аллергиях, астме"}],"compositionAnalysisResult":"*🚫 Особо насторожиться, если есть:*\\n\\n— E621, E627, E631 — усилители вкуса, которые могут вызывать привыкание и усиливать головные боли.\\\\n— E321 — антиоксидант, который может вызвать аллергические реакции.\\n\\n*✅ Общие рекомендации:*\\n\\n— Старайтесь ограничивать потребление продуктов с усилителями вкуса и антиоксидантами.\\\\n— Выбирайте продукты с минимальным количеством добавок и натуральными ингредиентами.\\n\\n*❤️ Вывод нутрициолога:*\\n\\n— Будьте внимательны к составу продуктов, особенно если у вас есть аллергии или хронические заболевания.\\\\n— По возможности, готовьте блюда самостоятельно, чтобы контролировать используемые ингредиенты."}',
          parsed: {
            photoCheck: { isContextCorrect: true, contextExplanation: '' },
            compositionAnalysisDetails: [
              {
                explanation:
                  '❗️E621 — усилитель вкуса (глутамат натрия)\\n— Может вызывать: головные боли, привыкание\\n— Не рекомендуется при: мигренях, гипертонии',
              },
              {
                explanation:
                  "❗️E627 — усилитель вкуса (динатрий 5'-гуанилат)\\n— Может усиливать действие глутамата натрия\\n— Не рекомендуется при: астме, подагре",
              },
              {
                explanation:
                  '❗️E631 — усилитель вкуса (динатрий инозинат)\\n— Может усиливать действие глутамата натрия\\n— Не рекомендуется при: астме, подагре',
              },
              {
                explanation:
                  '❗️E322 — эмульгатор (лецитин)\\n— Обычно безопасен, но может вызывать аллергические реакции у чувствительных людей',
              },
              {
                explanation:
                  '❗️E551 — антислеживающий агент (диоксид кремния)\\n— Обычно безопасен, но чрезмерное употребление может быть нежелательным',
              },
              {
                explanation:
                  '❗️E321 — антиоксидант (бутилгидрокситолуол)\\n— Может вызывать аллергические реакции\\n— Не рекомендуется при: аллергиях, астме',
              },
            ],
            compositionAnalysisResult:
              '*🚫 Особо насторожиться, если есть:*\n\n— E621, E627, E631 — усилители вкуса, которые могут вызывать привыкание и усиливать головные боли.\\n— E321 — антиоксидант, который может вызвать аллергические реакции.\n\n*✅ Общие рекомендации:*\n\n— Старайтесь ограничивать потребление продуктов с усилителями вкуса и антиоксидантами.\\n— Выбирайте продукты с минимальным количеством добавок и натуральными ингредиентами.\n\n*❤️ Вывод нутрициолога:*\n\n— Будьте внимательны к составу продуктов, особенно если у вас есть аллергии или хронические заболевания.\\n— По возможности, готовьте блюда самостоятельно, чтобы контролировать используемые ингредиенты.',
          },
        },
      ],
      role: 'assistant',
    },
  ],
  parallel_tool_calls: true,
  previous_response_id: null,
  prompt_cache_key: null,
  reasoning: { effort: null, summary: null },
  safety_identifier: null,
  service_tier: 'default',
  store: true,
  temperature: 0.2,
  text: {
    format: {
      type: 'json_schema',
      description: null,
      name: 'CompositionAnalysis',
      schema: {
        type: 'object',
        properties: {
          photoCheck: {
            type: 'object',
            properties: {
              isContextCorrect: {
                type: 'boolean',
                description:
                  'true, если на фото есть четкий состав продукта. false, если это что-то другое.',
              },
              contextExplanation: {
                type: 'string',
                description:
                  'Краткое объяснение на 1-2 предложения, что на фото, если isContextCorrect=false. Например: "На фото изображен пейзаж", "На фото чек из магазина". Формат MarkdownV2 в нотации Telegram.',
              },
            },
            required: ['isContextCorrect', 'contextExplanation'],
            additionalProperties: false,
            description: 'Первичная проверка содержимого фото.',
          },
          compositionAnalysisDetails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                explanation: {
                  type: 'string',
                  description:
                    'Анализ одного ингредиента или группы. Например: "❗️E621 — усилитель вкуса (глутамат натрия)\\n— Может вызывать: головные боли, привыкание\\n— Не рекомендуется при: мигренях, гипертонии". Формат MarkdownV2 в нотации Telegram.',
                },
              },
              required: ['explanation'],
              additionalProperties: false,
            },
            description:
              'Массив с детальным разбором каждого вредного или значимого ингредиента. Пустой массив, если состав полностью безопасен или photoCheck.isContextCorrect=false.',
          },
          compositionAnalysisResult: {
            type: 'string',
            description:
              'Полный, готовый для отправки в Telegram отчет в формате MarkdownV2 в нотации Telegram, включающий общие рекомендации и вывод нутрициолога. Если photoCheck.isContextCorrect=false, это поле должно быть пустой строкой.',
          },
        },
        required: [
          'photoCheck',
          'compositionAnalysisDetails',
          'compositionAnalysisResult',
        ],
        additionalProperties: false,
      },
      strict: true,
    },
    verbosity: 'medium',
  },
  tool_choice: 'auto',
  tools: [],
  top_logprobs: 0,
  top_p: 1,
  truncation: 'disabled',
  usage: {
    input_tokens: 3124,
    input_tokens_details: { cached_tokens: 0 },
    output_tokens: 476,
    output_tokens_details: { reasoning_tokens: 0 },
    total_tokens: 3600,
  },
  user: null,
  metadata: {},
  output_text:
    '{"photoCheck":{"isContextCorrect":true,"contextExplanation":""},"compositionAnalysisDetails":[{"explanation":"❗️E621 — усилитель вкуса (глутамат натрия)\\\\n— Может вызывать: головные боли, привыкание\\\\n— Не рекомендуется при: мигренях, гипертонии"},{"explanation":"❗️E627 — усилитель вкуса (динатрий 5\'-гуанилат)\\\\n— Может усиливать действие глутамата натрия\\\\n— Не рекомендуется при: астме, подагре"},{"explanation":"❗️E631 — усилитель вкуса (динатрий инозинат)\\\\n— Может усиливать действие глутамата натрия\\\\n— Не рекомендуется при: астме, подагре"},{"explanation":"❗️E322 — эмульгатор (лецитин)\\\\n— Обычно безопасен, но может вызывать аллергические реакции у чувствительных людей"},{"explanation":"❗️E551 — антислеживающий агент (диоксид кремния)\\\\n— Обычно безопасен, но чрезмерное употребление может быть нежелательным"},{"explanation":"❗️E321 — антиоксидант (бутилгидрокситолуол)\\\\n— Может вызывать аллергические реакции\\\\n— Не рекомендуется при: аллергиях, астме"}],"compositionAnalysisResult":"*🚫 Особо насторожиться, если есть:*\\n\\n— E621, E627, E631 — усилители вкуса, которые могут вызывать привыкание и усиливать головные боли.\\\\n— E321 — антиоксидант, который может вызвать аллергические реакции.\\n\\n*✅ Общие рекомендации:*\\n\\n— Старайтесь ограничивать потребление продуктов с усилителями вкуса и антиоксидантами.\\\\n— Выбирайте продукты с минимальным количеством добавок и натуральными ингредиентами.\\n\\n*❤️ Вывод нутрициолога:*\\n\\n— Будьте внимательны к составу продуктов, особенно если у вас есть аллергии или хронические заболевания.\\\\n— По возможности, готовьте блюда самостоятельно, чтобы контролировать используемые ингредиенты."}',
  output_parsed: {
    photoCheck: { isContextCorrect: true, contextExplanation: '' },
    compositionAnalysisDetails: [
      {
        explanation:
          '❗️E621 — усилитель вкуса (глутамат натрия)\\n— Может вызывать: головные боли, привыкание\\n— Не рекомендуется при: мигренях, гипертонии',
      },
      {
        explanation:
          "❗️E627 — усилитель вкуса (динатрий 5'-гуанилат)\\n— Может усиливать действие глутамата натрия\\n— Не рекомендуется при: астме, подагре",
      },
      {
        explanation:
          '❗️E631 — усилитель вкуса (динатрий инозинат)\\n— Может усиливать действие глутамата натрия\\n— Не рекомендуется при: астме, подагре',
      },
      {
        explanation:
          '❗️E322 — эмульгатор (лецитин)\\n— Обычно безопасен, но может вызывать аллергические реакции у чувствительных людей',
      },
      {
        explanation:
          '❗️E551 — антислеживающий агент (диоксид кремния)\\n— Обычно безопасен, но чрезмерное употребление может быть нежелательным',
      },
      {
        explanation:
          '❗️E321 — антиоксидант (бутилгидрокситолуол)\\n— Может вызывать аллергические реакции\\n— Не рекомендуется при: аллергиях, астме',
      },
    ],
    compositionAnalysisResult:
      '*🚫 Особо насторожиться, если есть:*\n\n— E621, E627, E631 — усилители вкуса, которые могут вызывать привыкание и усиливать головные боли.\\n— E321 — антиоксидант, который может вызвать аллергические реакции.\n\n*✅ Общие рекомендации:*\n\n— Старайтесь ограничивать потребление продуктов с усилителями вкуса и антиоксидантами.\\n— Выбирайте продукты с минимальным количеством добавок и натуральными ингредиентами.\n\n*❤️ Вывод нутрициолога:*\n\n— Будьте внимательны к составу продуктов, особенно если у вас есть аллергии или хронические заболевания.\\n— По возможности, готовьте блюда самостоятельно, чтобы контролировать используемые ингредиенты.',
  },
};

const resposeFailed = {
  id: 'resp_68960cc768a881a1ba0da5c58fc92a9901ab534488395c0d',
  object: 'response',
  created_at: 1754664135,
  status: 'completed',
  background: false,
  error: null,
  incomplete_details: null,
  instructions: null,
  max_output_tokens: null,
  max_tool_calls: null,
  model: 'gpt-4o-2024-08-06',
  output: [
    {
      id: 'msg_68960cc99b9081a1bde7780915c67f0501ab534488395c0d',
      type: 'message',
      status: 'completed',
      content: [
        {
          type: 'output_text',
          annotations: [],
          logprobs: [],
          text: '{"photoCheck":{"isContextCorrect":false,"contextExplanation":"На фото изображены бутылки с алкоголем на полке магазина."},"compositionAnalysisDetails":[],"compositionAnalysisResult":""}',
          parsed: {
            photoCheck: {
              isContextCorrect: false,
              contextExplanation:
                'На фото изображены бутылки с алкоголем на полке магазина.',
            },
            compositionAnalysisDetails: [],
            compositionAnalysisResult: '',
          },
        },
      ],
      role: 'assistant',
    },
  ],
  parallel_tool_calls: true,
  previous_response_id: null,
  prompt_cache_key: null,
  reasoning: { effort: null, summary: null },
  safety_identifier: null,
  service_tier: 'default',
  store: true,
  temperature: 0.2,
  text: {
    format: {
      type: 'json_schema',
      description: null,
      name: 'CompositionAnalysis',
      schema: {
        type: 'object',
        properties: {
          photoCheck: {
            type: 'object',
            properties: {
              isContextCorrect: {
                type: 'boolean',
                description:
                  'true, если на фото есть четкий состав продукта. false, если это что-то другое.',
              },
              contextExplanation: {
                type: 'string',
                description:
                  'Краткое объяснение на 1-2 предложения, что на фото, если isContextCorrect=false. Например: "На фото изображен пейзаж", "На фото чек из магазина". Формат MarkdownV2 в нотации Telegram.',
              },
            },
            required: ['isContextCorrect', 'contextExplanation'],
            additionalProperties: false,
            description: 'Первичная проверка содержимого фото.',
          },
          compositionAnalysisDetails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                explanation: {
                  type: 'string',
                  description:
                    'Анализ одного ингредиента или группы. Например: "❗️E621 — усилитель вкуса (глутамат натрия)\\n— Может вызывать: головные боли, привыкание\\n— Не рекомендуется при: мигренях, гипертонии". Формат MarkdownV2 в нотации Telegram.',
                },
              },
              required: ['explanation'],
              additionalProperties: false,
            },
            description:
              'Массив с детальным разбором каждого вредного или значимого ингредиента. Пустой массив, если состав полностью безопасен или photoCheck.isContextCorrect=false.',
          },
          compositionAnalysisResult: {
            type: 'string',
            description:
              'Полный, готовый для отправки в Telegram отчет в формате MarkdownV2 в нотации Telegram, включающий общие рекомендации и вывод нутрициолога. Если photoCheck.isContextCorrect=false, это поле должно быть пустой строкой.',
          },
        },
        required: [
          'photoCheck',
          'compositionAnalysisDetails',
          'compositionAnalysisResult',
        ],
        additionalProperties: false,
      },
      strict: true,
    },
    verbosity: 'medium',
  },
  tool_choice: 'auto',
  tools: [],
  top_logprobs: 0,
  top_p: 1,
  truncation: 'disabled',
  usage: {
    input_tokens: 3294,
    input_tokens_details: { cached_tokens: 0 },
    output_tokens: 41,
    output_tokens_details: { reasoning_tokens: 0 },
    total_tokens: 3335,
  },
  user: null,
  metadata: {},
  output_text:
    '{"photoCheck":{"isContextCorrect":false,"contextExplanation":"На фото изображены бутылки с алкоголем на полке магазина."},"compositionAnalysisDetails":[],"compositionAnalysisResult":""}',
  output_parsed: {
    photoCheck: {
      isContextCorrect: false,
      contextExplanation:
        'На фото изображены бутылки с алкоголем на полке магазина.',
    },
    compositionAnalysisDetails: [],
    compositionAnalysisResult: '',
  },
};
