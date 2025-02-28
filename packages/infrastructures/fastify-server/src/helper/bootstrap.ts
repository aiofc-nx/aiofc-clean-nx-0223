import {
  ConfigKeyPaths,
  ConfigService,
  getAppConfig,
  getSwaggerConfig,
} from '@aiofc/config';
import { Logger } from '@aiofc/logger';
import { RedisUtility } from '@aiofc/redis';
import { configureAuthSwaggerDocs, configureSwaggerDocs } from '@aiofc/swagger';
import { generateRandomId } from '@aiofc/utils';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { fastifyAddHook } from '../lib/fastify-add-hook';
import { fastifyRegisterPlugins } from '../lib/fastify-register-plugin';

function buildFastifyAdapter(): FastifyAdapter {
  const REQUEST_ID_HEADER = 'x-request-id';
  return new FastifyAdapter({
    // 给每一个请求分配一个ID，用于追踪请求：
    // 1、如果请求已经有了'x-request-id'
    // 2、否则生成一个随机ID
    genReqId: (req: { headers: { [x: string]: any } }) => {
      const requestId = req.headers[REQUEST_ID_HEADER];
      return requestId || generateRandomId();
    },
    bodyLimit: 10_485_760,
  });
}

export async function bootstrap(module: any) {
  await RedisUtility.client();
  // 创建应用
  const fastifyAdapter = buildFastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    fastifyAdapter,
    {
      // 设置为 true 时，日志消息将被暂时存储（缓冲）而不是立即输出。
      bufferLogs: true,
      // TODO: 将关闭NestJS内置的日志记录
      logger: false, //这行代码可能会导致启动失败
    }
  );

  // 获取配置
  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const appConfig = getAppConfig(configService);
  const swaggerConfig = getSwaggerConfig(configService);
  process.env['NODE_ENV'] = appConfig?.NODE_ENV; // 设置环境变量,后面会用到一定要设置

  //  Fastify 设置
  fastifyAddHook(app);
  if (appConfig) {
    fastifyRegisterPlugins(app, appConfig);
  }
  // 使用PinoLogger
  const pino = app.get(Logger);
  app.useLogger(pino);
  // 刷新日志
  app.flushLogs();

  // 注册ShutdownHooks
  app.enableShutdownHooks();

  // Swagger Configurations
  if (swaggerConfig) {
    configureAuthSwaggerDocs(app, swaggerConfig);
    configureSwaggerDocs(app, swaggerConfig);
  }
  // 设置全局前缀
  app.setGlobalPrefix(appConfig.globalPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  // 启动应用
  const port = appConfig.port || 3000;
  await app.listen(port, '0.0.0.0', async () => {
    pino.log(`Server is running on ${await app.getUrl()}`, 'Server'); // 修正了多余的括号
  });
  if (process.env['NODE_ENV'] !== 'production') {
    pino.debug(
      `${await app.getUrl()} - Environment: ${process.env['NODE_ENV']}`,
      'Environment'
    );

    pino.debug(
      `Url for OpenApi: ${await app.getUrl()}/${swaggerConfig.path}`,
      'Swagger'
    );
  }
}
