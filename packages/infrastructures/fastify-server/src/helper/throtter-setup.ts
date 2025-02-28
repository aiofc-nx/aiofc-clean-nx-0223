import { ConfigKeyPaths, IRedisConfig, IThrottlerConfig } from '@aiofc/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import Redis from 'ioredis';

// https://github.com/jmcdo29/nest-lab/tree/main/packages/throttler-storage-redis
class ThrottlerStorageAdapter implements ThrottlerStorage {
  constructor(private readonly storageService: ThrottlerStorageRedisService) {}

  /**
   * 增加限流计数
   *
   * 该方法用于增加指定键的限流计数，并返回更新后的存储记录。
   *
   * @param key - 限流的唯一标识符
   * @param ttl - 该限流记录的生存时间（以秒为单位）
   * @param limit - 限流的最大请求数
   * @param blockDuration - 超过限制后阻塞的持续时间（以秒为单位）
   * @param throttlerName - 限流器的名称
   * @returns 返回更新后的限流存储记录
   */
  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    return this.storageService.increment(
      key,
      ttl,
      limit,
      blockDuration,
      throttlerName
    );
  }
}

/**
 * 设置限流模块
 *
 * 该函数用于异步配置限流模块，使用 Redis 作为存储后端。
 * 它从配置服务中获取限流相关的配置参数，并根据 Redis 的模式
 * 创建相应的限流存储服务。
 *
 * @returns {DynamicModule} 返回配置好的限流模块
 */
export const setupThrottlerModule = (): DynamicModule => {
  return ThrottlerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
      // 从配置服务中获取限流配置
      const { ttl, limit, errorMessage } = configService.get<IThrottlerConfig>(
        'throttler',
        {
          infer: true,
        }
      );

      // 从配置服务中获取 Redis 配置
      const redisOpts = configService.get<IRedisConfig>('redis', {
        infer: true,
      });

      let throttlerStorageRedisService: ThrottlerStorageRedisService;

      // 根据 Redis 模式创建相应的限流存储服务
      if (redisOpts.mode === 'cluster') {
        throttlerStorageRedisService = new ThrottlerStorageRedisService(
          new Redis.Cluster(redisOpts.cluster)
        );
      } else {
        throttlerStorageRedisService = new ThrottlerStorageRedisService(
          new Redis({
            host: redisOpts.standalone.host,
            port: redisOpts.standalone.port,
            password: redisOpts.standalone.password,
            db: redisOpts.standalone.db,
          })
        );
      }

      // 创建限流存储适配器
      const storageAdapter = new ThrottlerStorageAdapter(
        throttlerStorageRedisService
      );

      // 返回限流模块的配置
      return {
        errorMessage: errorMessage,
        throttlers: [{ ttl, limit }],
        storage: storageAdapter,
      };
    },
  });
};
