import { z } from 'zod';
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
export type IRedisConfig = z.infer<typeof redisZodSchema>;
