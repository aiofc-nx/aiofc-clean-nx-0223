---
title: 数据库
group: Documents
category: Guides
---

## 数据库

我们使用 drizzle 作为数据库 ORM，并使用 postgres 作为数据库。

@aifc-nx-2025/drizzle-schema 是一个专门用于管理本项目数据表的工具。已完成的功能包括：

- 数据库迁移
- 提供了一致的数据表定义函数

## Schema 文件

Schema 文件位于 `packages/drizzle-schema/src/schema`，
但是，为了与plateform项目共享schema，我们将schema文件放到了到platform项目中，并通过软链接的方式链接到drizzle-schema中。

```ts
// eslint-disable-next-line @nx/enforce-module-boundaries
export * from '../../../../apps/platform/src/database/schema';
```

## 表结构

platform是一个多租户系统，所以，每张表都包含了一些系统功能性的字段，包括：

- `id`：主键，唯一标识符
- `tenantId`：租户ID，用于区分不同租户的数据
- `createdAt`：创建时间，默认使用当前时间
- `updatedAt`：更新时间，默认使用当前时间
- `deletedAt`：删除时间，用于软删除

我们定义了 `createTenantTable` 函数，用于创建包含这些字段的表。

```ts
export const createTenantTable = <T extends Record<string, any>>(
  tableName: string,
  columns: T = {} as T,
) => {
  return pgTable(tableName, {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
    ...columns,
  });
};
```

你可以优雅地使用这个函数来创建你的数据表。例如：

```ts
const userTable = createTenantTable('user', {
  name: text('name').notNull(),
  email: text('email').notNull()
});
```

### 字段说明

- `id`：主键，唯一标识符，使用uuid生成
- `tenantId`：租户ID，使用uuid生成，每一行数据都包含一个租户ID，用于标识数据的租户归属。即使所有租户的数据都存储在同一个数据库的同一个schema中，我们仍然可以使用租户ID来区分不同的租户数据。
- `createdAt`：创建时间，默认使用当前时间
- `updatedAt`：更新时间，默认使用当前时间
- `deletedAt`：删除时间，用于软删除

## 数据库迁移

我们使用 drizzle-kit 来管理数据库迁移。

```bash
pnpm run db:generate
pnpm run db:migrate
```

这些脚本我们已经配置在project.json文件，因为我们使用了Nx作为系统的构建工具，所有的命令都通过Nx来执行。

你在使用这些命令时，需要确保你已经配置了正确的环境变量，示例如下：

```bash
NODE_ENV=development
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=aiofc_db
DB_PORT=5438
DB_SCHEMA=public
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
MIGRATIONS_FOLDER=packages/drizzle-schema/src/migrations/aiofc
```

这些环境变量会被packages/drizzle-schema/src/lib/aiofc.config.ts文件使用。

事实上，在调用前我们还做了一层封装和校验，确保你已经配置了正确的环境变量。所以，真正调用的是packages/drizzle-schema/src/lib/env.ts文件。
