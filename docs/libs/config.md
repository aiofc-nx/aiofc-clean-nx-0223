# 配置模块

NestJS 提供了一个配置模块，但是，对于我们的项目来说，还需要增加以下功能：

* 以Yaml格式来配置环境变量
* 增加环境变量的校验功能
* 增加类型安全
* 环境变量的分组导出

::: tip
使用 `yaml` 格式来配置环境变量，可以让我们更方便的进行配置，并且增加配置的可读性。同时，我们还希望避免使用 `process.env` 来获取环境变量，从而避免环境变量被别的应用或者代码污染，而且 `process.env` 在单元测试中无法使用。
:::

::: info
校验功能我们使用 `zod` 来实现，而不是使用`class-validator`，这样可以增加代码的可读性，因为我实在受不了一长串的装饰器。同时，`zod` 在前端项目广泛使用，而 `class-validator` 只在 `nestjs` 后端项目使用。我们希望前后端的技术栈尽量统一。
:::

::: tip
环境变量的分组导出，可以让我们更方便的进行配置，并且增加配置的可读性。
:::

::: info
类型安全是 `TypeScript` 的灵魂，我们希望配置文件也能享受到类型安全的优势。
:::

## 功能实现

我们将结合 `@nestjs/config`、`js-yaml` 和 `zod` 来实现类型安全的 YAML 配置加载。

---

### 1. 安装依赖

确保你已经安装了以下依赖：

```bash
npm install @nestjs/config js-yaml zod
```

---

### 2. 创建 YAML 配置文件

在项目根目录下创建一个 `config.yaml` 文件，用于定义环境变量。例如：

```yaml
app:
  port: 3000
  env: development
  debug: true

database:
  host: localhost
  port: 5432
  username: user
  password: pass
```

---

### 3. 定义配置 Schema 并使用 `registerAs`

使用 `zod` 定义配置的校验规则，并通过 `registerAs` 注册配置。

#### 创建 `config.schema.ts`

```typescript
import { z } from 'zod';
import { registerAs } from '@nestjs/config';

// 定义 App 配置的校验规则
const appConfigSchema = z.object({
  port: z.number().min(1).max(65535).default(3000),
  env: z.enum(['development', 'production', 'test']).default('development'),
  debug: z.boolean().default(false),
});

// 定义 Database 配置的校验规则
const dbConfigSchema = z.object({
  host: z.string(),
  port: z.number().min(1).max(65535),
  username: z.string(),
  password: z.string(),
});

// 使用 registerAs 注册 App 配置
export const AppConfig = registerAs('app', () => {
  const config = loadYamlConfig().app; // 从 YAML 文件中加载配置
  const result = appConfigSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`App config validation error: ${result.error.message}`);
  }

  return result.data;
});

// 使用 registerAs 注册 Database 配置
export const DbConfig = registerAs('database', () => {
  const config = loadYamlConfig().database; // 从 YAML 文件中加载配置
  const result = dbConfigSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Database config validation error: ${result.error.message}`);
  }

  return result.data;
});

// 提取配置类型
export type IAppConfig = z.infer<typeof appConfigSchema>;
export type IDbConfig = z.infer<typeof dbConfigSchema>;

// 加载 YAML 配置文件
const loadYamlConfig = () => {
  const yaml = require('js-yaml');
  const fs = require('fs');
  const filePath = 'config.yaml'; // YAML 文件路径
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents);
};
```

---

### 4. 在 `AppModule` 中加载配置

在 `AppModule` 中加载配置模块，并注册 `AppConfig` 和 `DbConfig`。

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, DbConfig } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, DbConfig], // 加载配置
    }),
  ],
})
export class AppModule {}
```

---

### 5. 使用类型安全的配置服务

在服务或控制器中，通过 `ConfigService` 访问配置，并享受类型安全的优势。

#### 在服务中使用配置

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig, IDbConfig } from './config/config.schema';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService<IAppConfig & IDbConfig>,
  ) {}

  getConfig() {
    const appPort = this.configService.get('app.port'); // 类型安全
    const dbHost = this.configService.get('database.host'); // 类型安全
    return { appPort, dbHost };
  }
}
```

---

### 6. 示例 YAML 文件

假设你的 `config.yaml` 文件内容如下：

```yaml
app:
  port: 3000
  env: development
  debug: true

database:
  host: localhost
  port: 5432
  username: user
  password: pass
```

---

### 7. 类型安全的优势

通过这种方式，你可以享受到以下优势：

* **类型安全**：`zod` 会自动推断配置字段的类型，确保在访问配置时不会出错。
* **模块化配置**：使用 `registerAs` 可以将配置按模块划分，便于维护。
* **YAML 文件支持**：直接从 YAML 文件中加载配置，而不是依赖 `process.env`。

---

### 8. 完整的代码结构

以下是完整的代码结构：

```
src/
├── app.module.ts
├── app.service.ts
├── config/
│   ├── config.schema.ts
config.yaml
```

* **`config.schema.ts`**：定义 `zod` Schema 并使用 `registerAs` 注册配置。
* **`app.module.ts`**：加载配置模块。
* **`app.service.ts`**：使用类型安全的配置服务。
* **`config.yaml`**：YAML 配置文件。

---

### 9. 进一步优化

如果你有多个配置模块（如 Redis 配置、第三方 API 配置等），可以为每个模块单独定义 Schema 并使用 `registerAs` 注册。例如：

#### Redis 配置

```typescript
const redisConfigSchema = z.object({
  host: z.string(),
  port: z.number().min(1).max(65535),
  password: z.string().optional(),
});

export const RedisConfig = registerAs('redis', () => {
  const config = loadYamlConfig().redis;
  const result = redisConfigSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Redis config validation error: ${result.error.message}`);
  }

  return result.data;
});

export type IRedisConfig = z.infer<typeof redisConfigSchema>;
```

#### 在 `AppModule` 中加载多个配置

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, DbConfig, RedisConfig } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig, DbConfig, RedisConfig], // 加载多个配置
    }),
  ],
})
export class AppModule {}
```

---

### 总结

通过结合 `@nestjs/config`、`js-yaml` 和 `zod`，你可以实现从 YAML 文件中加载类型安全的配置。这种方式不仅提高了代码的可靠性，还增强了开发体验。如果你有其他问题或需要进一步的优化，请随时告诉我！
