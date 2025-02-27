import { z } from 'zod';

// 定义 App 配置的校验规则
export const appZodSchema = z.object({
  port: z.number().min(1).default(3000), // API服务端口，默认3000
  globalPrefix: z.string().default('api'), // API全局路由前缀，默认'api'
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'), // 环境变量，默认'development'
  cors: z
    .object({
      enabled: z.boolean().default(true), // 是否启用核心功能
      origin: z.array(z.string()).default(['http://localhost:3000']), // 允许的源
      methods: z.string().default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'), // 允许的 HTTP 方法
      preflight_continue: z.boolean().default(false), // 是否继续预检请求
      options_success_status: z.number().default(204), // 成功的预检请求返回的状态码
      credentials: z.boolean().default(true), // 是否允许携带凭证
      max_age: z.number().default(3600), // 预检请求的最大缓存时间
    })
    .default({}),
});

export type IAppConfig = z.infer<typeof appZodSchema>;
