# 代码结构

在 DDD（领域驱动设计）中，租户表的定义应该属于基础设施层（Infrastructure Layer）。让我们重新组织一下代码结构：

```
apps/platform/src/
├── domain/
│   └── tenant/
│       ├── entities/
│       │   └── tenant.entity.ts  (领域实体定义)
│       └── value-objects/
│           └── tenant-status.vo.ts
├── application/
│   └── tenant/
│       └── interfaces/
│           └── tenant.repository.interface.ts
└── infrastructure/
    └── persistence/
        └── tenant/
            ├── schemas/
            │   └── tenant.schema.ts  (当前的表定义应该移到这里)
            └── repositories/
                └── tenant.repository.ts
```

原因如下：

1. 表结构定义（schema）是与具体数据库实现相关的，属于基础设施层
2. 领域层应该只包含业务规则和领域逻辑，与具体的持久化技术无关
3. 应用层定义仓储接口，基础设施层实现这些接口

建议将当前的 `tenant.schema.ts` 移动到 `infrastructure/persistence/tenant/schemas/` 目录下，并创建相应的领域实体和仓储接口。

需要我帮您重构这部分代码吗？
