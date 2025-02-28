import { ConfigService } from '@nestjs/config';

import {
  IAppConfig,
  IDatabaseConfig,
  ILoggerConfig,
  IRedisConfig,
  ISwaggerConfig,
  IThrottlerConfig,
  ICryptoConfig,
} from '../zod-schema';

/**
 * 获取应用配置
 * @param configService ConfigService实例
 * @returns 应用配置对象
 * @example
 * ```ts
 * const appConfig = getAppConfig(configService);
 * ```
 */
export const getAppConfig = (configService: ConfigService): IAppConfig => {
  const config = configService.get<IAppConfig>('app');
  if (!config) {
    throw new Error('应用配置未找到');
  }
  return config;
};

/**
 * 获取日志配置
 * @param configService ConfigService实例
 * @returns 日志配置对象
 */
export const getLoggerConfig = (
  configService: ConfigService
): ILoggerConfig => {
  const config = configService.get<ILoggerConfig>('logger');
  if (!config) {
    throw new Error('日志配置未找到');
  }
  return config;
};

/**
 * 获取Swagger配置
 * @param configService ConfigService实例
 * @returns Swagger配置对象
 */
export const getSwaggerConfig = (
  configService: ConfigService
): ISwaggerConfig => {
  const config = configService.get<ISwaggerConfig>('swagger');
  if (!config) {
    throw new Error('Swagger配置未找到');
  }
  return config;
};

/**
 * 获取数据库配置
 * @param configService ConfigService实例
 * @returns 数据库配置对象
 */
export const getDatabaseConfig = (
  configService: ConfigService
): IDatabaseConfig => {
  const config = configService.get<IDatabaseConfig>('database');
  if (!config) {
    throw new Error('数据库配置未找到');
  }
  return config;
};

/**
 * 获取限流配置
 * @param configService ConfigService实例
 * @returns 限流配置对象
 */
export const getThrottlerConfig = (
  configService: ConfigService
): IThrottlerConfig => {
  const config = configService.get<IThrottlerConfig>('throttler');
  if (!config) {
    throw new Error('限流配置未找到');
  }
  return config;
};

/**
 * 获取Redis配置
 * @param configService ConfigService实例
 * @returns Redis配置对象
 */
export const getRedisConfig = (configService: ConfigService): IRedisConfig => {
  const config = configService.get<IRedisConfig>('redis');
  if (!config) {
    throw new Error('Redis配置未找到');
  }
  return config;
};

/**
 * 获取加密配置
 * @param configService ConfigService实例
 * @returns 加密配置对象
 */
export const getCryptoConfig = (
  configService: ConfigService
): ICryptoConfig => {
  const config = configService.get<ICryptoConfig>('crypto');
  if (!config) {
    throw new Error('加密配置未找到');
  }
  return config;
};
