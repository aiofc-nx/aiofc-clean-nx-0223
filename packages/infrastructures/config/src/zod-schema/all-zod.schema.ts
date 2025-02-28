import { RecordNamePaths } from '@aiofc/typings';
import { z } from 'zod';

import { appZodSchema, IAppConfig } from './app-zod.schema';
import { cryptoZodSchema, ICryptoConfig } from './crypto-zod.schema';
import { databaseZodSchema, IDatabaseConfig } from './database-zod.schema';
import { emailZodSchema, IEmailConfig } from './email-zod.schema';
import { ILoggerConfig, loggerZodSchema } from './logger-zod.schema';
import { IRedisConfig, redisZodSchema } from './redis-zod.schema';
import { ISwaggerConfig, swaggerZodSchema } from './swagger-zod.schema';
import { IThrottlerConfig, throttlerZodSchema } from './throttler-zod.schema';

// 合并所有配置的校验规则
export const allZodSchema = z.object({
  app: appZodSchema,
  logger: loggerZodSchema,
  swagger: swaggerZodSchema,
  database: databaseZodSchema,
  throttler: throttlerZodSchema,
  redis: redisZodSchema,
  email: emailZodSchema,
  crypto: cryptoZodSchema,
});

// 提取配置类型

export interface AllConfigType {
  app: IAppConfig;
  logger: ILoggerConfig;
  swagger: ISwaggerConfig;
  database: IDatabaseConfig;
  throttler: IThrottlerConfig;
  redis: IRedisConfig;
  email: IEmailConfig;
  crypto: ICryptoConfig;
}
export type IAllZodSchema = z.infer<typeof allZodSchema>;

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;
