import path from 'path';

import { setupConfigModule } from '@aiofc/config';
import { setupLoggerModule } from '@aiofc/logger';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AllExceptionFilter } from '../../filter/all-exception.filter';
import { setupClsModule } from '../../helper/cls-setup';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 配置模块，应当在所有模块之前导入，因为这是一个全局模块，其他模块需要使用 ConfigService
    setupConfigModule(
      path.join(__dirname, 'assets', 'config.development.yaml')
    ),
    // 日志模块
    setupLoggerModule(),
    // 缓存模块
    setupClsModule(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
