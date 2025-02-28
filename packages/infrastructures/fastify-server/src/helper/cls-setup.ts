import { DynamicModule } from '@nestjs/common';
import { ClsModule, ClsModuleOptions } from 'nestjs-cls';

/**
 * 设置 CLS 模块
 *
 * 该函数用于配置并返回 CLS 模块的动态模块。
 * 可以通过传入选项来定制 CLS 模块的行为。
 *
 * @param clsOptions - 可选的 CLS 模块配置选项
 * @returns {DynamicModule} 返回配置好的 CLS 模块
 *
 * @example
 * ```ts
 * const clsModule = setupClsModule({ /* 自定义选项 *\/ });
 * ```
 */
export function setupClsModule(clsOptions?: ClsModuleOptions): DynamicModule {
  return ClsModule.forRoot({
    global: true, // 设置为全局模块
    middleware: {
      mount: true, // 启用中间件挂载
      generateId: true, // 启用 ID 生成
      idGenerator: (req) => req.id.toString(), // 自定义 ID 生成器
    },
    ...clsOptions, // 合并用户提供的选项
  });
}
