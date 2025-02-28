import * as fs from 'fs';
import path from 'path';

import { registerAs } from '@nestjs/config';
import * as yaml from 'js-yaml';

import { allZodSchema } from './zod-schema';

let cachedConfig: any = null;

export function loadConfig(filePath: string) {
  if (!cachedConfig) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    cachedConfig = yaml.load(fileContent);
  }
  return cachedConfig;
}

export function validateConfig(filePath: string) {
  const config = loadConfig(filePath);
  // 校验配置项
  const parsedConfig = allZodSchema.safeParse(config); // 使用 Zod 进行校验
  if (!parsedConfig.success) {
    throw new Error(`配置验证失败: ${JSON.stringify(parsedConfig.error)}`);
  } else {
    console.log(`配置验证通过!`);
  }
  return parsedConfig.data; // 返回有效的配置数据
}

// 使用 validateConfig 函数
const validatedConfig = validateConfig(
  path.join(
    process.cwd(),
    'apps/fastify-mvc/src/assets',
    'config.development.yaml'
  )
);
// path.join(__dirname, 'assets', 'config.development.yaml')

// 直接从 validatedConfig 中提取配置
export const AppConfig = registerAs('app', () => validatedConfig.app);
export const LoggerConfig = registerAs('logger', () => validatedConfig.logger);
export const SwaggerConfig = registerAs(
  'swagger',
  () => validatedConfig.swagger
);
export const ThrottlerConfig = registerAs(
  'throttler',
  () => validatedConfig.throttler
);
export const DatabaseConfig = registerAs(
  'database',
  () => validatedConfig.database
);
export const RedisConfig = registerAs('redis', () => validatedConfig.redis);
export const CryptoConfig = registerAs('crypto', () => validatedConfig.crypto);
