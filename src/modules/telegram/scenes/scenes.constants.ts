// Константы для имён сцен, данных кнопок и тайм-аутов
export enum SCENES {
  START = 'start',
  MAIN_MENU = 'main_menu',
  SERVICES_INFO = 'services_info',
  SUPPORT = 'support',
}

export enum CALLBACK_DATA {
  GO_TO_MAIN_MENU = 'go_to_main_menu',
  GO_TO_SERVICES = 'go_to_services',
  GO_TO_SUPPORT = 'go_to_support',
}

export enum TIMEOUTS {
  DEFAULT = 5 * 60 * 1000, // 5 минут
}
