import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getSecureResource(): { message: string } {
    return {
      message:
        'Access to protected resources granted! This protected resource is displayed when the token is successfully provided.',
    };
  }
}
