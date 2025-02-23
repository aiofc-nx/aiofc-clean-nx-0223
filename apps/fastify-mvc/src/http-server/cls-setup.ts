import { DynamicModule } from '@nestjs/common';
import { ClsModule, ClsModuleOptions } from 'nestjs-cls';

export function setupClsModule(clsOptions?: ClsModuleOptions): DynamicModule {
  return ClsModule.forRoot({
    global: true,
    middleware: {
      mount: true,
      generateId: true,
      idGenerator: (req) => req.id.toString(),
    },
    ...clsOptions,
  });
}
