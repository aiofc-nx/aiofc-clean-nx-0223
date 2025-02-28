import { z } from 'zod';

// 定义 Swagger 配置的校验规则
export const swaggerZodSchema = z.object({
  enable: z.boolean().default(false), // 是否启用文档，默认false
  path: z.string().default('doc'), // 文档路径，默认'doc'
  user: z.string().default('admin'), // Swagger文档认证用户名，默认'admin'
  password: z.string().default('123456'), // Swagger文档认证密码，默认'123456'
});
export type ISwaggerConfig = z.infer<typeof swaggerZodSchema>;
