import path from 'path';

import { setupConfigModule } from '@aiofc/config';
import { setupClsModule } from '@aiofc/fastify-server';
import { setupThrottlerModule } from '@aiofc/fastify-server';
import { setupLoggerModule } from '@aiofc/logger';
import { Module } from '@nestjs/common';

import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';

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
    // 节流模块
    setupThrottlerModule(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
