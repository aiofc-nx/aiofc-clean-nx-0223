// 导出配置模块设置函数
export { setupConfigModule } from './utils/setup';

export type { ConfigKeyPaths } from './zod-schema';

export {
  // 导出所有配置类型
  IAppConfig,
  IDatabaseConfig,
  ILoggerConfig,
  IRedisConfig,
  ISwaggerConfig,
  IThrottlerConfig,
  ICryptoConfig,
  allZodSchema as IAllZodSchema,
} from './zod-schema';

export {
  AppConfig,
  DatabaseConfig,
  LoggerConfig,
  RedisConfig,
  ThrottlerConfig,
  SwaggerConfig,
  CryptoConfig,
} from './utils/validate';

// 重新导出配置服务，方便其他模块直接使用
export { ConfigService } from '@nestjs/config';

// 辅助函数，用于从ConfigService获取特定配置
export {
  getAppConfig,
  getLoggerConfig,
  getSwaggerConfig,
  getDatabaseConfig,
  getThrottlerConfig,
  getRedisConfig,
  getCryptoConfig,
} from './utils/gets';
