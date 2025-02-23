---
title: 拦截器
description: 拦截器是 NestJS 中的一种中间件，用于在请求处理过程中添加额外的逻辑。拦截器可以用于日志记录、权限验证、数据转换等操作。
---

## 拦截器

拦截器是 NestJS 中一个重要的概念，它允许开发者在请求处理的生命周期中插入自定义逻辑。拦截器的机制和实现原理可以从以下几个方面进行详细介绍：

### 1. 拦截器的定义

拦截器是实现了 `NestInterceptor` 接口的类。这个接口定义了一个 `intercept` 方法，该方法接收两个参数：

- `context`: `ExecutionContext` 对象，包含了当前请求的上下文信息。
- `next`: `CallHandler` 对象，表示下一个处理程序。

### 2. 拦截器的工作流程

拦截器的工作流程如下：

1. **请求到达**：当一个请求到达控制器时，NestJS 会首先查找与该请求匹配的拦截器。
2. **执行拦截器**：拦截器的 `intercept` 方法会被调用。在这个方法中，开发者可以添加自定义逻辑，比如日志记录、请求修改、响应修改等。
3. **调用下一个处理程序**：在拦截器中，开发者通常会调用 `next.handle()` 方法，这个方法返回一个 `Observable`，表示下一个处理程序的执行结果。
4. **处理响应**：拦截器可以在请求处理完成后，使用 `tap` 操作符或其他 RxJS 操作符来处理响应数据。
5. **返回响应**：最终，拦截器会返回一个 `Observable`，这个 `Observable` 会被 NestJS 订阅并返回给客户端。

### 3. 拦截器的用途

拦截器可以用于多种场景，包括但不限于：

- **日志记录**：记录请求和响应的详细信息。
- **请求验证**：在请求到达控制器之前进行验证。
- **响应格式化**：统一处理响应格式。
- **缓存**：实现请求的缓存机制。
- **异常处理**：捕获并处理请求中的异常。

### 4. 实现原理

拦截器的实现原理主要依赖于 NestJS 的依赖注入和中间件机制。具体来说：

- **依赖注入**：拦截器可以通过构造函数注入其他服务或模块，以便在拦截器中使用。
- **中间件机制**：拦截器在请求处理的生命周期中起到中间件的作用，可以在请求到达控制器之前和响应返回客户端之前插入逻辑。

### 5. 示例

以下是一个简单的拦截器示例，展示了如何记录请求的开始和结束时间：

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    console.log(`请求开始: ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        console.log(`请求结束: ${request.method} ${request.url} - 耗时: ${duration}ms`);
      }),
    );
  }
}
```

### 总结

拦截器是 NestJS 中强大的功能，允许开发者在请求处理的各个阶段插入自定义逻辑。通过实现 `NestInterceptor` 接口，开发者可以灵活地处理请求和响应，满足各种业务需求。
