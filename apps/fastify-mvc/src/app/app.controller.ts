import { Crypto, CryptoDirection, CryptoMethod } from '@aiofc/crypto';
import { ApiRes } from '@aiofc/rest';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '../interceptor/public.decorator';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

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
}
