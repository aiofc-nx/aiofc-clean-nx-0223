// import path from 'path';

import { setupConfigModule } from '@aiofc/config';
import {
  CryptoModule,
  CryptoMethod,
  AESMode,
  PaddingMode,
} from '@aiofc/crypto';
import { setupClsModule } from '@aiofc/fastify-server';
import { setupThrottlerModule } from '@aiofc/fastify-server';
import { setupLoggerModule } from '@aiofc/logger';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';

@Module({
  imports: [
    // 配置模块，应当在所有模块之前导入，因为这是一个全局模块，其他模块需要使用 ConfigService
    // setupConfigModule(
    //   path.join(__dirname, 'assets', 'config.development.yaml')
    // ),
    setupConfigModule(),
    // 日志模块
    setupLoggerModule(),
    // 缓存模块
    setupClsModule(),
    // 节流模块
    setupThrottlerModule(),
    // 健康检查模块
    TerminusModule,
    // 加密模块
    CryptoModule.register({
      isGlobal: true,
      defaultMethod: CryptoMethod.AES,
      aes: {
        mode: AESMode.CBC,
        padding: PaddingMode.PKCS7,
        useRandomIV: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
