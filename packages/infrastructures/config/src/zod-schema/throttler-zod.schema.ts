import { z } from 'zod';

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
export type IThrottlerConfig = z.infer<typeof throttlerZodSchema>;
