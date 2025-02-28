import { z } from 'zod';

// 定义 AES 配置的 Zod schema
const aesSchema = z.object({
  key: z.string().length(32, { message: 'AES key must be 32 characters long' }),
  iv: z.string().length(16, { message: 'AES IV must be 16 characters long' }),
});

// 定义 RSA 配置的 Zod schema
const rsaSchema = z.object({
  privateKey: z.string().min(1, { message: 'RSA private key is required' }),
  publicKey: z.string().min(1, { message: 'RSA public key is required' }),
});

// 定义 Crypto 配置的 Zod schema
export const cryptoZodSchema = z.object({
  aes: aesSchema,
  rsa: rsaSchema,
});

// 导出 Crypto 配置的 Zod schema
export type ICryptoConfig = z.infer<typeof cryptoZodSchema>;
