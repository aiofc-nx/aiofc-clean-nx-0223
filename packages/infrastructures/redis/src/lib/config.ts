import { IRedisConfig } from '@aiofc/config';
import { ConfigService } from '@nestjs/config';

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

// export const RedisConfig = getRedisConfig(new ConfigService());
