import { z } from 'zod';

// 定义 Email 配置的校验规则
export const emailZodSchema = z.object({
  host: z.string(),
  port: z.number(),
  auth: z.object({
    user: z.string(),
    password: z.string(),
  }),
  debug: z.boolean().default(false),
  logger: z.boolean().default(false),
});
export type IEmailConfig = z.infer<typeof emailZodSchema>;
