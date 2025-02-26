import { HttpException, HttpStatus } from '@nestjs/common';

import type { FailResponse, HttpFailResponse } from '../shared/interfaces';

export class NormalException extends HttpException {
  static HTTP_REQUEST_TIMEOUT(): NormalException {
    return new NormalException('HTTP Request Timeout', 10001);
  }

  static UNEXPECTED(msg?: string): NormalException {
    return new NormalException(msg || 'Unexpected Error', 10003);
  }

  static VALIDATION_ERROR(msg?: string): NormalException {
    return new NormalException(msg || 'Validation Error', 10002);
  }

  constructor(message: string, code: number) {
    super({ code, message }, HttpStatus.BAD_REQUEST);
  }

  // @Override
  getResponse(): FailResponse {
    return <FailResponse>super.getResponse();
  }

  toJSON(): HttpFailResponse {
    const response = this.getResponse();
    return {
      error: {
        code: response.code,
        message: response.message,
      },
    };
  }
}
