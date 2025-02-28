import * as fs from 'fs';
import path from 'path';

import { registerAs } from '@nestjs/config';
import * as yaml from 'js-yaml';

import { allZodSchema } from '../zod-schema';

let cachedConfig: any = null;

/**
 * 加载配置文件
 *
 * 该函数用于从指定的文件路径加载配置文件内容。它会检查缓存，如果缓存中没有配置，则读取文件内容并解析为对象。
 * 从而避免重复读取文件和解析 YAML 的过程。
 *
 * @param filePath - 配置文件的路径
 * @returns 返回加载的配置对象
 * @throws {Error} 如果读取文件或解析 YAML 时发生错误
 *
 * @example
 * ```ts
 * const config = loadConfig('path/to/config.yaml');
 * ```
 */
export function loadConfig(filePath: string) {
  if (!cachedConfig) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    cachedConfig = yaml.load(fileContent);
  }
  return cachedConfig;
}

/**
 * 验证配置文件的内容
 *
 * 该函数用于加载指定路径的配置文件，并使用 Zod 进行校验。
 * 如果配置验证失败，将抛出错误；如果验证通过，将返回有效的配置数据。
 *
 * @param filePath - 配置文件的路径
 * @returns 返回有效的配置数据
 * @throws {Error} 如果配置验证失败，将抛出包含错误信息的异常
 *
 * @example
 * ```ts
 * const validConfig = validateConfig('path/to/config.yaml');
 * ```
 */
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

/**
 * 验证并加载配置文件
 *
 * 该常量用于获取有效的配置数据。它首先检查环境变量中是否指定了配置文件路径，
 * 如果没有，则使用默认路径加载配置文件。通过调用 validateConfig 函数进行验证，
 * 确保加载的配置符合预期的结构和类型。
 *
 * @constant {Object} validatedConfig - 验证后的配置对象
 * @throws {Error} 如果配置验证失败，将抛出错误
 */
const validatedConfig = validateConfig(
  process.env['CONFIG_FILE_PATH'] ||
    path.join(
      process.cwd(),
      'apps/fastify-mvc/src/assets',
      'config.development.yaml'
    )
);

/**
 * 注册应用配置
 *
 * 该常量用于注册应用程序的配置数据。它从经过验证的配置中提取应用相关的设置。
 * 通过调用 registerAs 函数，将配置数据注册为可注入的服务。
 *
 * @returns {Object} 返回应用配置对象
 */
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
