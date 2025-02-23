# 日志系统

Nest 附带一个默认的内部日志记录器实现，但是，它只是一个 Service 类，并不是一个独立模块。我们之所以在终端能够看到日志输出，其实只是 `console.log` 语句而已。

之所以输出的内容有颜色变化，是因为终端支持 ANSI 转义码，Nest 通过一个工具模块 [cli-colors.util.ts](https://github.com/nestjs/nest/blob/master/packages/common/utils/cli-colors.util.ts) 使用了 ANSI 转义序列来控制文本的颜色和样式。

```typescript
// 在终端输出红色文本
console.log(cliColors.red('Hello, world!'));
```

这些日志记录也只能在终端看到，无法在文件中保存。

## 拆解 Nest 日志系统

[Nest 日志系统](https://github.com/nestjs/nest/tree/master/packages/common/services)

Nest 的日志系统，主要由两个类组成：

* `Logger`
* `ConsoleLogger`

### `Logger`

`Logger` 是一个高级封装的日志服务，提供了更多的功能特性，如日志缓冲、静态方法支持等。

* `Logger`:
  * 支持日志缓冲（Buffer）机制
  * 提供静态方法调用
  * 可以切换底层日志实现
  * 支持全局日志级别控制

### `ConsoleLogger`

`ConsoleLogger` 是一个具体的控制台日志实现，主要负责日志的格式化和实际输出。

* `ConsoleLogger`:
  * 专注于日志的具体输出实现
  * 提供丰富的日志格式化选项
  * 支持彩色输出
  * 支持 JSON 格式输出

### 区别与联系

* 两者都实现了 `LoggerService` 接口

* `Logger` 内部默认使用 `ConsoleLogger` 作为默认的日志实现，这是一种组合关系，而不是继承关系。而且，`Logger` 类可以组合其他的日志工具类实现日志的输出。

这一点我们可以在 `Logger` 类的源码中看到，具体代码：

```typescript
const DEFAULT_LOGGER = new ConsoleLogger();

@Injectable()
export class Logger implements LoggerService {
  protected static staticInstanceRef?: LoggerService = DEFAULT_LOGGER;
  // ...
}
```

由此可见，`Logger` 类内部默认依赖了 `ConsoleLogger` 作为默认的日志实现，但是，这种依赖是可以替换的。

我们可以通过 `Logger.overrideLogger()` 或依赖注入来替换。这种设计遵循了依赖倒置原则，通过 `LoggerService` 接口实现了低耦合。

一个更形象的比喻

* `ConsoleLogger` 就像发动机，负责核心的动力输出（日志输出）

* `Logger` 就像整车，它不仅包含发动机，还提供了更多的功能（如缓冲、静态方法等）

* 你可以更换发动机（通过 `overrideLogger`），但车子的基本功能不变。

总的来说，`Logger` 是一个更高层次的抽象，提供了更多的功能和灵活性，而 `ConsoleLogger` 则是具体的日志实现。在实际使用中，大多数情况下使用 `Logger` 就足够了，只有在需要自定义日志输出时才需要直接使用或继承 `ConsoleLogger`。

## 自定义日志记录器

我们可以自己实现一个自定义日志记录器，并由 Nest 作为系统记录器使用。

首先，实现 LoggerService 接口中的每个方法，具体代码：
[packages/pino-logger/src/lib/logger.ts](packages/pino-logger/src/lib/logger.ts)

实现了 Nest 的 LoggerService 接口，意味着我们的自定义日志类可以平替 Nest 的 Logger 类。
这个类和 Nest 的 Logger 类，在实现上非常相似，都是实现了 LoggerService 接口，从而保证了对 Nest 的 Logger 类的兼容。

所以（然后），把这个自定义的日志记录器的实例，作为 Nest 的logger属性的值，具体代码：

```typescript
const app = await NestFactory.create(ApplicationModule, {
  logger: new MyLogger(),
});
await app.listen(3000);

```

不过，我们使用时并没有这么做，因为这样的一个自定义日志记录器太过于简单，无法满足实际需求。而是创建了另一个日志类，它封装了 pino 库，pino 是一个高性能的日志库，具体代码:

[packages/pino-logger/src/lib/pino-logger.ts](packages/pino-logger/src/lib/pino-logger.ts)

在这个类的代码中，我们首先定义了一个类型，它从 pino.Logger 中选取了日志记录方法类型：

```typescript
type PinoMethods = Pick<
  pino.Logger,
  'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
>;
```

然后，我们定义一个`PinoLogger`类去实现这个类型，从而建立日志输出的能力。在实现的过程中，我们引入了 pino 库和cls缓存库，具体来说，这个类的能力来自于这两个库。

### 使用

让我解释一下 `Logger` 和 `PinoLogger` 这两个类的区别与联系：

### 主要区别

1. **接口实现**

* `Logger`: 实现了 NestJS 的 `LoggerService` 接口，提供标准的 NestJS 日志方法

* `PinoLogger`: 实现了 Pino 的日志方法，是对 Pino 的直接封装

2. **日志级别**

* `Logger`: 使用 NestJS 标准的日志级别：`verbose`, `debug`, `log`, `warn`, `error`, `fatal`

* `PinoLogger`: 使用 Pino 的日志级别：`trace`, `debug`, `info`, `warn`, `error`, `fatal`

3. **使用方式**

```typescript
// Logger 使用方式（NestJS 风格）
logger.log('消息', 'UserService');
logger.error('错误消息', 'UserService');

// PinoLogger 使用方式（Pino 风格）
pinoLogger.info({ context: 'UserService' }, '消息');
pinoLogger.error({ context: 'UserService', err: new Error() }, '错误消息');
```

### 关联关系

1. **依赖关系**

```typescript
@Injectable()
export class Logger implements LoggerService {
  constructor(
    protected readonly logger: PinoLogger,  // Logger 依赖 PinoLogger
    @Inject(PARAMS_PROVIDER_TOKEN) { renameContext }: LoggerParams
  ) {
    this.contextName = renameContext || 'context';
  }
  // ...
}
```

2. **适配器模式**

* `Logger` 作为适配器，将 NestJS 的日志接口转换为 Pino 的日志格式

* `PinoLogger` 作为具体实现，处理实际的日志记录

3. **日志转换示例**

```typescript
// Logger 中的转换逻辑
private call(level: Level, message: any, ...optionalParams: any[]) {
  const objArg: Record<string, any> = {};
  
  // 处理上下文
  if (optionalParams.length !== 0) {
    objArg[this.contextName] = optionalParams[optionalParams.length - 1];
    params = optionalParams.slice(0, -1);
  }

  // 转换为 Pino 格式并调用
  if (typeof message === 'object') {
    if (message instanceof Error) {
      objArg['err'] = message;
    } else {
      Object.assign(objArg, message);
    }
    this.logger[level](objArg, ...params);
  } else {
    this.logger[level](objArg, message, ...params);
  }
}
```

### 使用建议

1. **在 NestJS 应用中**：
   * 如果你想完全遵循 NestJS 的日志风格，使用 `Logger`
   * 适合与现有 NestJS 代码集成

2. **需要 Pino 特性时**：
   * 如果需要使用 Pino 的高级特性，直接使用 `PinoLogger`
   * 适合需要详细控制日志格式和性能的场景

3. **混合使用**：
   * 可以在同一个应用中根据需要混合使用两种 logger
   * 但建议在一个模块中保持统一的使用方式

这种设计既保证了与 NestJS 的兼容性，又不失 Pino 的强大特性，是一个很好的封装案例。
