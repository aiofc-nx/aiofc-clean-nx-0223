import * as fs from 'fs';

import { DynamicModule } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import * as yaml from 'js-yaml';

import {
  allConfigSchema,
  IAppConfig,
  ICorsConfig,
  IDatabaseConfig,
  ILoggerConfig,
  IRedisConfig,
  ISwaggerConfig,
  IThrottlerConfig,
} from './config.schema';

const validateConfig = (yamlFilePath: string) => {
  const config = yaml.load(fs.readFileSync(yamlFilePath, 'utf8')) as Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >;
  console.log(
    `已读取文件：${yamlFilePath} \n ${JSON.stringify(config, null, 2)}`
  );
  // 校验配置项
  const parsedConfig = allConfigSchema.safeParse(config); // 使用 Zod 进行校验
  if (!parsedConfig.success) {
    throw new Error(`配置验证失败: ${JSON.stringify(parsedConfig.error)}`);
  } else {
    console.log(`配置验证通过!`);
  }
  return parsedConfig;
};

export const setupConfigModule: (
  yamlFilePath: string
) => Promise<DynamicModule> = async (yamlFilePath) => {
  const parsedConfig = validateConfig(yamlFilePath) as {
    success: true;
    data: {
      app: IAppConfig;
      logger: ILoggerConfig;
      swagger: ISwaggerConfig;
      database: IDatabaseConfig;
      cors: ICorsConfig;
      throttler: IThrottlerConfig;
      redis: IRedisConfig;
    };
  };
  // 注册应用配置
  const AppConfig = registerAs('app', () => parsedConfig.data.app);
  // 注册日志配置
  const LoggerConfig = registerAs('logger', () => parsedConfig.data.logger);
  // 注册Swagger配置
  const SwaggerConfig = registerAs('swagger', () => parsedConfig.data.swagger);
  // 注册CORS配置
  const CorsConfig = registerAs('cors', () => parsedConfig.data.cors);
  // 注册限流配置
  const ThrottlerConfig = registerAs(
    'throttler',
    () => parsedConfig.data.throttler
  );
  // 注册数据库配置
  const DatabaseConfig = registerAs(
    'database',
    () => parsedConfig.data.database
  );
  // 注册Redis配置
  const RedisConfig = registerAs('redis', () => parsedConfig.data.redis);

  return ConfigModule.forRoot({
    isGlobal: true, // 必须全局导入，因为Logger 和 Database 等模块需要使用 ConfigService
    load: [
      AppConfig,
      LoggerConfig,
      SwaggerConfig,
      DatabaseConfig,
      CorsConfig,
      ThrottlerConfig,
      RedisConfig,
    ], // 传入 YAML 文件路径
  });
};
