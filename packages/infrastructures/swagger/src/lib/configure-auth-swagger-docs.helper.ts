import type { ISwaggerConfig } from '@aiofc/config';
import { INestApplication } from '@nestjs/common';

export function configureAuthSwaggerDocs(
  app: INestApplication,
  config: ISwaggerConfig
) {
  const apiDocumentationCredentials = {
    user: config.user,
    password: config.password,
  };
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use(config.path, (req: any, res: any, next: () => void) => {
    function parseAuthHeader(input: string): {
      user: string;
      password: string;
    } {
      const [, encodedPart] = input.split(' ');
      const buff = Buffer.from(encodedPart, 'base64');
      const text = buff.toString('ascii');
      const [user, password] = text.split(':');
      return { user, password };
    }

    function unauthorizedResponse(): void {
      if (httpAdapter.getType() === 'fastify') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
      } else {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic');
      }
      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (
      credentials?.user !== apiDocumentationCredentials.user ||
      credentials?.password !== apiDocumentationCredentials.password
    ) {
      return unauthorizedResponse();
    }

    next();
  });
}
