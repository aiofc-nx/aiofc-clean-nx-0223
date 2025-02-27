import { IAppConfig } from '@aiofc/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { getCorsConfig } from './cors.option';
import { getHelmetConfig } from './security.option';

export async function fastifyRegisterPlugins(
  app: NestFastifyApplication,
  appConfig: IAppConfig
) {
  await app.register(require('@fastify/multipart'), {
    limits: {
      fields: 10, // Max number of non-file fields
      fileSize: 1024 * 1024 * 6, // limit size 6M
      files: 5, // Max number of file fields
    },
  });

  await app.register(require('@fastify/cors'), getCorsConfig(appConfig));

  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });
  // 注册 Helmet 安全中间件
  // @description 提供基本的安全防护，包括 XSS、CSP、HSTS 等
  // @link https://github.com/helmetjs/helmet
  // @link https://github.com/fastify/fastify-helmet
  // 本地环境不开启,具体配置请参考官方文档

  await app.register(require('@fastify/helmet'), getHelmetConfig());

  // 注册压缩
  await app.register(require('@fastify/compress'));
  // TODO: 注册CSRF
  await app.register(require('@fastify/csrf-protection') as any);
}
