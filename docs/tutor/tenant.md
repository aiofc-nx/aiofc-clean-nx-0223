---
title: 租户
group: Documents
category: Tutor
children:
    - ../tutor/tenant-description.md
---

让我总结一下这个多租户系统的关键特点：

### 架构设计

1. **租户隔离策略**
   - 支持两种隔离模式：Schema 隔离和行级隔离（Row Level Security）
   - 通过配置 `TenantIsolationStrategy` 灵活切换

2. **租户上下文管理**
   - 使用 `nestjs-cls` 实现请求级别的租户上下文
   - `TenantContextService` 管理租户 ID 的存取
   - `TenantMiddleware` 自动从请求头提取租户信息

### 数据库设计

1. **基础表结构**
   - 统一的基础字段：id, tenantId, createdAt, updatedAt, deletedAt
   - 使用 `createTenantTable` 工厂函数创建带租户字段的表

2. **连接池管理**
   - 统一的数据库连接池配置
   - 支持事务级别的租户上下文切换

### 功能特性

1. **租户管理**
   - 完整的 CRUD 操作
   - 软删除支持
   - 租户代码唯一性校验
   - 数据验证（使用 Zod）

2. **安全特性**
   - UUID 用于租户标识
   - Schema 名称编码（使用 base62）
   - 请求头租户 ID 格式验证

### 已实现的核心功能

1. 租户创建和管理
2. 多租户数据隔离
3. 租户上下文传递
4. 基础的数据安全保护
5. 完整的单元测试覆盖

这个实现为多租户应用提供了一个可靠的基础架构，支持灵活的隔离策略和安全的数据访问控制。
