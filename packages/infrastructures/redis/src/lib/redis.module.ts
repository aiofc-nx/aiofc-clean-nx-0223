import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisUtility } from './redis.util';

@Module({
  imports: [ConfigModule],
  providers: [RedisUtility],
  exports: [RedisUtility],
})
export class RedisModule {}
