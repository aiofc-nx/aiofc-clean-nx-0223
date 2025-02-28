import { z } from 'zod';

// 定义 Logger 配置的校验规则
export const loggerZodSchema = z.object({
  colorize: z.boolean().default(false),
  prettyLogs: z.boolean().default(false),
  defaultLevel: z.string().default('info'),
});
export type ILoggerConfig = z.infer<typeof loggerZodSchema>;
