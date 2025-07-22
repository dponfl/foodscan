export class CommonHelpers {
  static getUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Приостанавливает выполнение на указанное количество миллисекунд.
   * @param ms - Время задержки в миллисекундах.
   */
  // static sleep(ms: number): Promise<undefined>;
  /**
   * Приостанавливает выполнение и возвращает указанное значение.
   * @param ms - Время задержки в миллисекундах.
   * @param value - Значение, которое будет возвращено после задержки.
   */
  // static sleep<T>(ms: number, value: T): Promise<T>;

  // Реализация
  static sleep<T>(ms: number, value?: T): Promise<T | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }
}
