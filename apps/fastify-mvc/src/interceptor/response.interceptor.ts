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

/**
 * 响应拦截器，用于格式化所有非错误响应以符合 Google JSON 风格。
 * @template T - 响应数据的类型。
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, HttpSuccessResponse<T>>
{
  /**
   * 拦截请求并处理响应。
   * @param _context - 执行上下文。
   * @param next - 下一个处理程序。
   * @returns 返回格式化后的成功响应。
   */
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<HttpSuccessResponse<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
