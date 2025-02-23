---
title: 日志
group: Documents
category: Tutor
children:
  - ./interceptor.md
---

## 日志模块

我们的日志模块没有使用 NestJS 官方提供的日志模块，而是使用了 [pino](https://github.com/pinojs/pino) 和 [pino-pretty](https://github.com/pinojs/pino-pretty) 来实现日志功能。

从我们的业务需求来看，上述的模块并没有提供以下功能：

1. 日志的Cls上下文缓存
2. 日志与Fastify的集成
3. 日志与Drizzle数据库的集成
4. 日志与多租户业务逻辑的集成
5. 日志的格式化需要更多的灵活性

pino 本身就是一个非常优秀的日志工具，选择它是因为它和fastify和drizzle的紧密度较高，fastify本身就集成了pino，drizzle-orm也有官方的库与pino集成。我们要做的就是按照 NestJS 的规范进行模块化封装，这里头有几个开发关键点：

社区里其实也有一个 [nestjs-pino](https://github.com/iamolegga/nestjs-pino) 的库，但是考虑到日志功能对于一个复杂应用系统的支持度很重要，我们需要更多的灵活性来适应我们的业务需求，所以，我们直接把这个库的全部代码移植到我们的项目，并在此基础上进行改造。改造的内容包括：

- 使用 ClsService 来实现日志的上下文缓存
- 重写了了日志拦截器
