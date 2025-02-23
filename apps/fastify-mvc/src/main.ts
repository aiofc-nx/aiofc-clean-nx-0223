import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import {
  applyExpressCompatibility,
  buildFastifyAdapter,
} from './http-server/fastify-setup';
import { Logger } from '@aiofc/logger';
import { ConfigKeyPaths, IAppConfig, ICorsConfig } from '@aiofc/config';
import { ConfigService } from '@nestjs/config';
import { FastifyInstance } from 'fastify';
import { registerHelmet } from './http-server/security.adapter';
import { fastifyApp } from './http-server/fastify.adapter';
import fastifyCompress from '@fastify/compress';
import fastifyCsrf from '@fastify/csrf-protection';
async function bootstrap() {
  // 创建应用
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    buildFastifyAdapter(),
    {
      // 设置为 true 时，日志消息将被暂时存储（缓冲）而不是立即输出。
      bufferLogs: true,
      // TODO: 将关闭NestJS内置的日志记录
      logger: false, //这行代码可能会导致启动失败
    }
  );
  // 使用PinoLogger
  const pino = app.get(Logger);
  app.useLogger(pino);
  // 刷新日志
  app.flushLogs();
  // 获取配置
  const configService = app.get(ConfigService<ConfigKeyPaths>);

  const appConfig = configService.get<IAppConfig>('app');
  const corsConfig = configService.get<ICorsConfig>('cors');
  // 直接访问和操作 Fastify 实例，利用 Fastify 提供的各种功能和插件来扩展和定制你的 NestJS 应用程序。
  const fastifyInstance: FastifyInstance = app.getHttpAdapter().getInstance();
  // 提高 Fastify 与 Express 的兼容性
  applyExpressCompatibility(fastifyInstance);
  // 注册 Helmet 安全中间件
  // @description 提供基本的安全防护，包括 XSS、CSP、HSTS 等
  // @link https://github.com/helmetjs/helmet
  // @link https://github.com/fastify/fastify-helmet
  // 本地环境不开启,具体配置请参考官方文档
  await registerHelmet(fastifyApp.getInstance(), {
    contentSecurityPolicy: appConfig?.NODE_ENV
      ? false
      : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https:', 'wss:'],
          },
        },
  });
  // 注册压缩
  await app.register(fastifyCompress);
  // TODO: 注册CSRF
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await app.register(fastifyCsrf as any);
  // 注册ShutdownHooks
  app.enableShutdownHooks();
  // 启用跨域资源共享
  if (corsConfig?.enabled) {
    app.enableCors({
      origin: corsConfig?.origin,
      methods: corsConfig?.methods,
      preflightContinue: corsConfig?.preflight_continue,
      optionsSuccessStatus: corsConfig?.options_success_status,
      credentials: corsConfig?.credentials,
      maxAge: corsConfig?.max_age,
    });
  }

  // 启动应用
  await app.listen(appConfig?.port || 3008, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
