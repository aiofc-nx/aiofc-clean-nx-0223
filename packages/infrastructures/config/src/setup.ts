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
  // validateConfig,
} from './validate';

export const setupConfigModule: () // yamlFilePath: string
=> Promise<DynamicModule> = async () => {
  // const validatedConfig = validateConfig();
  // if (!validatedConfig) {
  //   throw new Error('配置验证失败');
  // }

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
    // 如果需要，可以将 validatedConfig 传递给其他模块
    // 或者在这里使用 validatedConfig 进行其他操作
  });
};
