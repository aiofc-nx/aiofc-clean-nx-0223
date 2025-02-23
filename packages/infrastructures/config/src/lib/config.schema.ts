import { RecordNamePaths } from '@aiofc/typings';
import { z } from 'zod';
// 定义 App 配置的校验规则
export const appZodSchema = z.object({
  port: z.number().min(1).default(3000), // API服务端口，默认3000
  globalPrefix: z.string().default('api'), // API全局路由前缀，默认'api'
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'), // 环境变量，默认'development'
});

// 定义 Logger 配置的校验规则
export const loggerZodSchema = z.object({
  colorize: z.boolean().default(false),
  prettyLogs: z.boolean().default(false),
  defaultLevel: z.string().default('info'),
});

// 定义 Swagger 配置的校验规则
export const swaggerZodSchema = z.object({
  enable: z.boolean().default(false), // 是否启用文档，默认false
  path: z.string().default('doc'), // 文档路径，默认'doc'
});

// 定义 Database 配置的校验规则
export const databaseZodSchema = z.object({
  user: z.string(), // 数据库用户名
  password: z.string(), // 数据库密码
  host: z.string(), // 数据库主机地址
  port: z.coerce.number().default(5432),
  name: z.string(), // 数据库名称
});

// 定义 CORS 配置的校验规则
export const corsZodSchema = z.object({
  enabled: z.boolean().default(true), // CORS 是否启用
  origin: z.array(z.string()).default(['http://localhost:3000']), // 允许的源
  methods: z.string().default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'), // 允许的 HTTP 方法
  preflight_continue: z.boolean().default(false), // 是否继续预检请求
  options_success_status: z.number().default(204), // 成功的预检请求返回的状态码
  credentials: z.boolean().default(true), // 是否允许携带凭证
  max_age: z.number().default(3600), // 预检请求的最大缓存时间
});

// 定义 Throttler 配置的校验规则
export const throttlerZodSchema = z.object({
  ttl: z.number().default(60000), // 限流的时间窗口，单位为毫秒
  limit: z.number().default(10), // 在时间窗口内允许的最大请求次数
  errorMessage: z
    .string()
    .default(
      "Oops! Looks like you've hit our rate limit. Please take a short break and try again shortly"
    ), // 达到限流时返回的错误消息
});

// 定义 Redis 配置的校验规则
export const redisZodSchema = z.object({
  mode: z.enum(['standalone', 'cluster', 'sentinel']).default('standalone'), // Redis 模式
  standalone: z.object({
    host: z.string().default('localhost'), // Redis 主机
    port: z.number().default(26379), // Redis 端口
    password: z.string().default('123456'), // Redis 密码
    db: z.number().default(5), // Redis 数据库索引
  }),
  cluster: z
    .array(
      z.object({
        host: z.string(), // 集群节点主机
        port: z.number(), // 集群节点端口
        password: z.string().optional(), // 集群节点密码
      })
    )
    .default([]), // 集群节点数组
  sentinel: z.object({
    sentinels: z
      .array(
        z.object({
          host: z.string(), // 哨兵节点主机
          port: z.number(), // 哨兵节点端口
        })
      )
      .default([]), // 哨兵节点数组
    name: z.string().default('master'), // 主节点名称
    password: z.string().optional(), // 哨兵密码
    db: z.number().default(5), // 哨兵数据库索引
  }),
});

// 合并所有配置的校验规则
export const allConfigSchema = z.object({
  app: appZodSchema,
  logger: loggerZodSchema,
  cors: corsZodSchema,
  swagger: swaggerZodSchema,
  database: databaseZodSchema,
  throttler: throttlerZodSchema,
  redis: redisZodSchema, // 添加 Redis 校验规则
});

// 提取配置类型
export type IAppConfig = z.infer<typeof appZodSchema>;
export type ILoggerConfig = z.infer<typeof loggerZodSchema>;
export type IDatabaseConfig = z.infer<typeof databaseZodSchema>;
export type ICorsConfig = z.infer<typeof corsZodSchema>;
export type IThrottlerConfig = z.infer<typeof throttlerZodSchema>;
export type IRedisConfig = z.infer<typeof redisZodSchema>; // 提取 Redis 配置类型
export type ISwaggerConfig = z.infer<typeof swaggerZodSchema>;
export type IAllConfig = z.infer<typeof allConfigSchema>;

export interface AllConfigType {
  app: IAppConfig;
  logger: ILoggerConfig;
  cors: ICorsConfig;
  swagger: ISwaggerConfig;
  database: IDatabaseConfig;
  throttler: IThrottlerConfig;
  redis: IRedisConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;
