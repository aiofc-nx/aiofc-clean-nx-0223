import { createHash } from 'crypto';
import * as fs from 'fs/promises';

import { Crypto, CryptoDirection, CryptoMethod } from '@aiofc/crypto';
import { ApiRes } from '@aiofc/rest';
import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import '@fastify/multipart'; // 这会导入类型扩展
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Throttle } from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';

import { ApiResponseDoc } from '../interceptor/api-result.decorator';
import { Public } from '../interceptor/public.decorator';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    // private readonly db: DatabaseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator
  ) {}

  @Get()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/crypto')
  @Public()
  @Crypto(CryptoMethod.AES, CryptoDirection.ENCRYPT)
  getCrypto(): ApiRes<string> {
    return ApiRes.success(this.appService.getHello());
  }

  @Get('secure')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Example of a protected resource',
  })
  getProtectedResource(): { message: string } {
    return this.appService.getSecureResource();
  }

  @Post('/crypto')
  @Public()
  @Crypto(CryptoMethod.AES, CryptoDirection.BOTH)
  postCrypto(@Body() data: string): ApiRes<any> {
    // 由于使用了 @Crypto 装饰器，data 已经被自动解密
    return ApiRes.success({
      receivedData: data,
      timestamp: new Date().toISOString(),
    });
  }

  @Post('upload')
  @Public()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '文件上传' })
  @ApiResponseDoc({ type: String, isArray: true })
  async uploadFiles(@Req() req: FastifyRequest) {
    /**
     * fastify/multipart
     * fastify有几种文件上传中间件,单总体来说都谈不上好用
     * 很多第三方中间件会选择用decorator来实现,但经过考虑还是用最简单的fastify/multipart
     * https://github.com/fastify/fastify-multipart
     * 此处仅给出最简单使用案例,具体业务逻辑自行拓展
     */
    const parts = req.files();
    const formFields: Record<string, any> = {};
    const uploadPromises = [];

    const today = new Date();
    const date = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    const baseDir = '.file';
    const targetDir = `${baseDir}/pic/application/${date}`;
    await fs.mkdir(targetDir, { recursive: true });

    for await (const part of parts) {
      if (part.fields) {
        Object.entries(part.fields).forEach(([key, value]) => {
          if (
            value &&
            'type' in value &&
            value.type === 'field' &&
            'value' in value
          ) {
            formFields[key] = value.value;
          }
        });
      }

      const fileBuffer = await part.toBuffer();
      const md5 = createHash('md5')
        .update(new Uint8Array(fileBuffer))
        .digest('hex');
      const extension = part.filename.split('.').pop();
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 15);
      const fileName = `${md5}-${timestamp}-${random}.${extension}`;
      const filePath = `${targetDir}/${fileName}`;
      const relativePath = filePath;

      uploadPromises.push(
        fs.writeFile(filePath, fileBuffer).then(() => ({ path: relativePath }))
      );
    }

    const results = await Promise.all(uploadPromises);

    if (results.length === 0) {
      return ApiRes.error(400, 'No files uploaded.');
    }

    console.log('Form fields:', formFields);

    const paths = results.map((result) => result.path);
    return ApiRes.success({
      files: paths,
      fields: formFields,
    });
  }

  @Get('/healthy')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://www.google.com'),
      // () => this.db.pingCheck('database', this.prisma, { timeout: 1000 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get('/system-info')
  async getSystemInfo() {
    const result = await this.appService.getSystemInfo();
    return ApiRes.success(result);
  }

  @Get('/redis-info')
  async getRedisInfo() {
    const result = await this.appService.getRedisInfo();
    return ApiRes.success(result);
  }
}
