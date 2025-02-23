// 原nestjs-throttler-storage-redis废弃,迁移至@nest-lab/throttler-storage-redis
// https://github.com/kkoomen/nestjs-throttler-storage-redis

import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';

// https://github.com/jmcdo29/nest-lab/tree/main/packages/throttler-storage-redis
export class ThrottlerStorageAdapter implements ThrottlerStorage {
  constructor(private readonly storageService: ThrottlerStorageRedisService) {}

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
