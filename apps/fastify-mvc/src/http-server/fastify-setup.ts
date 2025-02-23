import { generateRandomId } from '@aiofc/utils';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';


export function applyExpressCompatibility(fastifyInstance: FastifyInstance) {
  // 这是Fastify的建议，以提高与Express Middlewares的兼容性
  fastifyInstance
    .addHook('onRequest', async (req) => {
      (req.socket as { encrypted?: boolean }).encrypted =
        process.env.NODE_ENV === 'production';
    })
    .decorateReply('setHeader', function (name: string, value: unknown) {
      this.header(name, value);
    })
    .decorateReply('end', function () {
      this.send('');
    });
}
// TODO: FastifyAdapter 是 Fastify 的 NestJS 适配器，它允许我们在 NestJS 应用中使用 Fastify。
export function buildFastifyAdapter(): FastifyAdapter {
  const REQUEST_ID_HEADER = 'x-request-id';
  return new FastifyAdapter({
    // 给每一个请求分配一个ID，用于追踪请求：
    // 1、如果请求已经有了'x-request-id'
    // 2、否则生成一个随机ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genReqId: (req: { headers: { [x: string]: any } }) => {
      const requestId = req.headers[REQUEST_ID_HEADER];
      return requestId || generateRandomId();
    },
    bodyLimit: 10_485_760,
  });
}
