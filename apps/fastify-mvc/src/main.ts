import { bootstrap } from '@aiofc/fastify-server';

import { AppModule } from './app.module';
console.log('process.cwd()>>>>>>>>>>>>>>>>>>>>', process.cwd());
bootstrap(AppModule);
