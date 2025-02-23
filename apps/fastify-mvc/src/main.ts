import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
async function bootstrap() {
  // 创建应用
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      // 设置为 true 时，日志消息将被暂时存储（缓冲）而不是立即输出。
      bufferLogs: true,
      // 将关闭NestJS内置的日志记录
      // logger: false,
    }
  );
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
