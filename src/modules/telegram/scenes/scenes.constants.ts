// Константы для имён сцен, данных кнопок и тайм-аутов
export enum SCENES {
  START = 'start',
  MAIN_MENU = 'main_menu',
  CHECK_PRODUCT = 'check_product',
  TARIFFS = 'tariffs',
  PAYMENT = 'payment',
  PROFILE = 'profile',
  SUPPORT = 'support',
}

export enum CALLBACK_DATA {
  GO_TO_MAIN_MENU = 'go_to_main_menu',
  GO_TO_CHECK_PRODUCT = 'go_to_check_product',
  GO_TO_TARIFFS = 'go_to_tariffs',
  GO_TO_PAYMENT = 'go_to_payment',
  GO_TO_PROFILE = 'go_to_profile',
  GO_TO_SUPPORT = 'go_to_support',
  GO_TO_PAYMENT_OPTION_ONE = 'go_to_payment_option_one',
  GO_TO_PAYMENT_OPTION_TWO = 'go_to_payment_option_two',
  GO_TO_PAYMENT_OPTION_THREE = 'go_to_payment_option_three',
  GO_TO_PAYMENT_OPTION_FOUR = 'go_to_payment_option_four',
}

export enum WAITING_FOR_INPUT {
  PRODUCT_PHOTO = 'product_photo',
}

export enum TIMEOUTS {
  DEFAULT = 5 * 60 * 1000, // 5 минут
  AFTER_START = 3 * 1000, // 3 секунды
}

export enum PAYMENT_OPTIONS {
  ONE_TIME = 'one_time',
  TEN_TIMES = 'ten_times',
  MONTH = 'month',
  YEAR = 'year',
}
