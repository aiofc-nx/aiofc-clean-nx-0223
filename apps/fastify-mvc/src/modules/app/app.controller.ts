import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: 'Example of a public resource',
  })
  getHello(): { message: string } {
    return this.appService.getHello();
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
