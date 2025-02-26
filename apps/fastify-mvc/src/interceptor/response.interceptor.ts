import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
// import type { HttpSuccessResponse } from '../share/interfaces';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { HttpSuccessResponse } from '../shared/interfaces';

// Re-format all non-error response to fit Google JSON style
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, HttpSuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<HttpSuccessResponse<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
