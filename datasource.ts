import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Загружаем переменные окружения из .env файла
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'], // CLI работает с скомпилированными .js файлами
  migrations: ['dist/migrations/*.js'], // Указываем, где искать миграции
  logging: true,
  synchronize: false, // synchronize всегда должен быть false при использовании миграций
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
