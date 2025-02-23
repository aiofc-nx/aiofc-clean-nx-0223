import { ConfigKeyPaths, IRedisConfig, IThrottlerConfig } from '@aiofc/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';

import { ThrottlerStorageAdapter } from './throttler-storage.adapter';

export const setupThrottlerModule = (): DynamicModule => {
  return ThrottlerModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
      const { ttl, limit, errorMessage } = configService.get<IThrottlerConfig>(
        'throttler',
        {
          infer: true,
        }
      );

      const redisOpts = configService.get<IRedisConfig>('redis', {
        infer: true,
      });

      let throttlerStorageRedisService: ThrottlerStorageRedisService;

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

      const storageAdapter = new ThrottlerStorageAdapter(
        throttlerStorageRedisService
      );

      return {
        errorMessage: errorMessage,
        throttlers: [{ ttl, limit }],
        storage: storageAdapter,
      };
    },
  });
};
