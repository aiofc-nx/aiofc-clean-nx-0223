import { IAppConfig } from '@aiofc/config';

export function getCorsConfig(appConfig: IAppConfig) {
  const corsConfig = {
    origin: appConfig.cors.origin,
    methods: appConfig.cors.methods,
    preflightContinue: appConfig.cors.preflight_continue,
    optionsSuccessStatus: appConfig.cors.options_success_status,
    credentials: appConfig.cors.credentials,
    maxAge: appConfig.cors.max_age,
  };
  return corsConfig;
}
