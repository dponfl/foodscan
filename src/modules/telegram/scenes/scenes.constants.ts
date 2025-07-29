// Константы для имён сцен, данных кнопок и тайм-аутов
export enum SCENES {
  START = 'start',
  MAIN_MENU = 'main_menu',
  CHECK_PRODUCT = 'check_product',
  TARIFFS = 'tariffs',
  PAYMENT = 'payment',
  STATISTICS = 'statistics',
  SUPPORT = 'support',
}

export enum CALLBACK_DATA {
  GO_TO_MAIN_MENU = 'go_to_main_menu',
  GO_TO_CHECK_PRODUCT = 'go_to_check_product',
  GO_TO_TARIFFS = 'go_to_tariffs',
  GO_TO_PAYMENT = 'go_to_payment',
  GO_TO_STATISTICS = 'go_to_statistics',
  GO_TO_SUPPORT = 'go_to_support',
}

export enum WAITING_FOR_INPUT {
  PRODUCT_PHOTO = 'product_photo',
  SUPPORT = 'support',
}

export enum TIMEOUTS {
  DEFAULT = 5 * 60 * 1000, // 5 минут
  AFTER_START = 3 * 1000, // 3 секунды
}
