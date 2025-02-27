import { IncomingMessage, ServerResponse } from 'node:http';

import { ConfigKeyPaths, ILoggerConfig } from '@aiofc/config';
import { ConfigService } from '@nestjs/config';
import { ClsService, ClsStore } from 'nestjs-cls';

import { LoggerModule } from './logger.module';

/**
 * 设置日志模块的配置函数
 *
 * 主要功能:
 * - 配置Pino日志记录器的行为
 * - 支持自定义请求属性
 * - 集成CLS(Continuation Local Storage)服务
 * - 提供灵活的日志格式化和序列化选项
 *
 * 工作机制:
 * 1. 通过异步工厂方法创建日志配置
 * 2. 使用ConfigService获取日志配置参数
 * 3. 支持通过CLS服务在请求上下文中传递数据
 * 4. 提供完整的请求生命周期日志记录
 *
 * @template ClsType - CLS存储类型参数
 * @param customProps - 自定义属性回调函数,用于扩展日志属性
 * @returns 配置好的LoggerModule动态模块
 */
export function setupLoggerModule<ClsType extends ClsStore>(
  customProps: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    clsService?: ClsService<ClsType>
  ) => Record<string, string> = () => ({})
) {
  return LoggerModule.forRootAsync({
    // imports: [ConfigModule], // ConfigModule 被配置为全局模块，所以不需要在这里导入，避免重复初始化
    inject: [ConfigService, { token: ClsService, optional: true }],
    providers: [],
    useFactory: async (
      configService: ConfigService<ConfigKeyPaths>,
      clsService?: ClsService<ClsType>
    ) => {
      const config = configService.get<ILoggerConfig>('logger');
      return {
        renameContext: 'class',
        pinoHttp: {
          // 格式化日志级别
          formatters: {
            level: (label) => {
              return { level: label };
            },
          },
          // 添加自定义属性到日志
          customProps: (req, res) => {
            return customProps(req, res, clsService);
          },
          // 成功响应日志对象格式化
          customSuccessObject: (
            req: IncomingMessage,
            _res: ServerResponse,
            val: any
          ) => {
            return {
              reqId: req.id,
              responseTime: val.responseTime,
            };
          },
          // 请求信息序列化
          serializers: {
            req: (req) => ({
              method: req.method,
              url: req.url,
            }),
          },
          // 错误响应日志对象格式化
          customErrorObject: (
            _req: IncomingMessage,
            res: ServerResponse,
            _error: Error,
            val: any
          ) => {
            return {
              statusMessage: res.statusMessage,
              statusCode: res.statusCode,
              err: val.err,
            };
          },
          // 请求接收时的日志消息
          customReceivedMessage: (req: IncomingMessage) => {
            return `Call Endpoint: ${req.method} ${req.url}`;
          },
          // 请求成功时的日志消息
          customSuccessMessage: (
            req: IncomingMessage,
            _res: ServerResponse,
            responseTime: number
          ) => {
            return `Finished Endpoint: ${req.method} ${req.url} for ${responseTime}ms`;
          },
          // 请求失败时的日志消息
          customErrorMessage: (
            req: IncomingMessage,
            _res: ServerResponse,
            error: Error
          ) => {
            return `Failed Endpoint: ${req.method} ${req.url} Error - ${error.message}.`;
          },
          // 根据状态码动态设置日志级别
          customLogLevel: function (_req, res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
              return 'info';
            } else if (res.statusCode >= 500 || err) {
              return 'error';
            } else if (res.statusCode >= 300 && res.statusCode < 400) {
              return 'silent';
            }
            return 'info';
          },
          // 安静请求日志记录
          quietReqLogger: true,
          // 自动记录请求日志
          autoLogging: true,
          // 定义其他自定义请求属性
          level: config?.defaultLevel,
          // 安装" pino-pretty"软件包，以便使用以下选项
          transport: config?.prettyLogs ? { target: 'pino-pretty' } : undefined,
        },
      };
    },
  });
}
