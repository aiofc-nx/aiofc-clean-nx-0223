export { LoggerModule } from './lib/logger.module';
export { Logger } from './lib/logger';
export { PinoLogger } from './lib/pino-logger';
export { InjectPinoLogger, getLoggerToken } from './lib/inject-pino-logger';
export { LoggerErrorInterceptor } from './lib/logger-error.interceptor';
export {
  Params,
  LoggerModuleAsyncParams,
  PARAMS_PROVIDER_TOKEN,
} from './lib/params';
export { setupLoggerModule } from './lib/setup';
