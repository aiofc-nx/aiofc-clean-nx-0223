import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  AppConfig,
  CryptoConfig,
  DatabaseConfig,
  LoggerConfig,
  RedisConfig,
  SwaggerConfig,
  ThrottlerConfig,
} from './validate';

export const setupConfigModule: () => Promise<DynamicModule> = async () => {
  return ConfigModule.forRoot({
    isGlobal: true, // 必须全局导入，因为Logger 和 Database 等模块需要使用 ConfigService
    load: [
      AppConfig,
      LoggerConfig,
      SwaggerConfig,
      DatabaseConfig,
      ThrottlerConfig,
      RedisConfig,
      CryptoConfig,
    ],
  });
};
