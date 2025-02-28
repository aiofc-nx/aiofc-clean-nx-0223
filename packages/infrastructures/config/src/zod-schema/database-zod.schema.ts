import { z } from 'zod';

// 定义 Database 配置的校验规则
export const databaseZodSchema = z.object({
  user: z.string(), // 数据库用户名
  password: z.string(), // 数据库密码
  host: z.string(), // 数据库主机地址
  port: z.coerce.number().default(5432),
  name: z.string(), // 数据库名称
});
export type IDatabaseConfig = z.infer<typeof databaseZodSchema>;
