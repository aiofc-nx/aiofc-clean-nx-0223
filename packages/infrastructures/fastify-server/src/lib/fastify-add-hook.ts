import { USER_AGENT } from '@aiofc/constants';
import { Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

function onRequestHook(fastifyInstance: FastifyInstance) {
  // 这是Fastify的建议，以提高与Express Middlewares的兼容性
  fastifyInstance
    .addHook('onRequest', async (req) => {
      (req.socket as { encrypted?: boolean }).encrypted =
        process.env['NODE_ENV'] === 'production';
    })
    .decorateReply('setHeader', function (name: string, value: unknown) {
      this.header(name, value);
    })
    .decorateReply('end', function () {
      this.send('');
    });
}

function onErrorHook(fastifyInstance: FastifyInstance) {
  fastifyInstance.addHook(
    'onError',
    async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
      const ip = request.ip;
      const userAgent = request.headers[USER_AGENT];
      const url = request.url;
      const method = request.method;

      Logger.error(
        `Server Error: ${error.message}\n` +
          `Method: ${method}\n` +
          `URL: ${url}\n` +
          `IP: ${ip}\n` +
          `User-Agent: ${userAgent}`,
        error.stack,
        'fastify.adapter'
      );

      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message:
          process.env['NODE_ENV'] === 'production'
            ? '服务器内部错误'
            : error.message,
      });
    }
  );
}
export function fastifyAddHook(app: NestFastifyApplication) {
  const fastifyInstance: FastifyInstance = app.getHttpAdapter().getInstance();
  onRequestHook(fastifyInstance);
  onErrorHook(fastifyInstance);
}
