import { ICorsConfig } from '@aiofc/config';

export function getCorsConfig(corsConfig: ICorsConfig) {
  return {
    origin: corsConfig?.origin,
    methods: corsConfig?.methods,
    preflightContinue: corsConfig?.preflight_continue,
    optionsSuccessStatus: corsConfig?.options_success_status,
    credentials: corsConfig?.credentials,
    maxAge: corsConfig?.max_age,
  };
}
