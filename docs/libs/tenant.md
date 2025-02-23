# 多租户系统架构说明文档

## 1. 系统概述

本系统采用多租户架构，支持数据隔离和租户管理。系统通过数据库Schema隔离和行级安全策略实现租户数据隔离，并提供完整的租户生命周期管理功能。

## 2. 核心组件

### 2.1 租户管理模块

* **位置**: `apps/platform/src/modules/tenant/`
* **功能**:
  * 租户的创建、查询、更新、删除
  * 租户Schema管理
  * 租户信息维护
* **主要接口**:
  * POST `/tenants` - 创建新租户
  * GET `/tenants` - 获取所有租户
  * GET `/tenants/:id` - 获取指定租户
  * PUT `/tenants/:id` - 更新租户信息
  * DELETE `/tenants/:id` - 删除租户

### 2.2 租户上下文管理

* **位置**: `apps/platform/src/database/services/tenant-context.service.ts`
* **功能**:
  * 使用CLS（Continuation Local Storage）管理租户上下文
  * 存储和获取当前租户的Schema和ID
* **主要方法**:
  * `setTenantSchemaInCls(schema: string)` - 设置当前租户Schema
  * `getTenantSchemaFromCls()` - 获取当前租户Schema
  * `setTenantId(tenantId: string)` - 设置当前租户ID
  * `getTenantId()` - 获取当前租户ID

### 2.3 租户中间件

* **位置**: `apps/platform/src/database/middleware/tenant.middleware.ts`

* **功能**:
  * 从请求头中提取租户Schema
  * 验证租户Schema格式
  * 设置租户上下文
  * 排除特定路径的租户检查
* **主要逻辑**:
  * 检查请求路径是否在排除列表中
  * 验证`x-tenant-schema`请求头
  * 设置租户Schema到CLS中

### 2.4 数据库服务

* **位置**: `apps/platform/src/database/services/database.service.ts`

* **功能**:
  * 管理数据库连接
  * 实现租户隔离策略
  * 创建和管理租户Schema
  * 提供租户特定的数据库连接
* **主要特性**:
  * 支持两种租户隔离策略：
    * `SCHEMA` - 每个租户使用独立的数据库Schema
    * `ROW` - 使用行级安全策略进行数据隔离
  * 自动初始化数据库结构
  * 提供租户特定的数据库连接

## 3. 数据隔离策略

### 3.1 Schema隔离

* 每个租户拥有独立的数据库Schema

* 系统自动创建和管理租户Schema
* 优点：数据完全隔离，安全性高
* 缺点：Schema数量可能较多，管理复杂

### 3.2 行级安全

* 所有租户共享同一个Schema

* 通过行级安全策略实现数据隔离
* 优点：管理简单，资源利用率高
* 缺点：需要更严格的安全控制

## 4. 请求处理流程

1. 请求到达
2. 租户中间件处理：
   * 检查请求路径
   * 验证`x-tenant-schema`请求头
   * 设置租户上下文
3. 控制器处理业务逻辑
4. 数据库服务根据租户上下文提供相应的数据库连接
5. 执行数据库操作
6. 返回响应

## 5. 配置与初始化

### 5.1 应用模块配置

* **位置**: `apps/platform/src/app.module.ts`

* **配置项**:
  * 注册租户中间件
  * 配置日志、国际化等模块
  * 初始化数据库模块

### 5.2 数据库初始化

* 创建必要的数据库参数

* 启用行级安全性
* 初始化公共Schema

## 6. 安全与验证

* 租户Schema格式验证：`t_[a-zA-Z0-9_]+`
* 请求头验证：`x-tenant-schema`必须存在且格式正确
* 数据库操作前验证Schema是否存在
* 使用CLS确保租户上下文的一致性

## 7. 扩展与维护

### 7.1 添加新租户

1. 调用`POST /tenants`接口创建租户
2. 系统自动创建对应的数据库Schema
3. 初始化Schema中的表结构

### 7.2 修改隔离策略

* 修改`database.service.ts`中的`isolationStrategy`配置

* 根据策略调整数据库初始化逻辑

### 7.3 添加新表

* 在`initializeSchemaStructure`方法中添加新表的创建逻辑

* 确保新表符合租户隔离策略的要求

## 8. 最佳实践

* 始终通过租户上下文服务获取当前租户信息
* 在数据库操作前验证租户上下文是否设置
* 使用事务确保数据一致性
* 定期清理未使用的租户Schema
* 监控数据库连接池的使用情况

## 9. 故障排查

* 检查`x-tenant-schema`请求头是否正确设置
* 验证租户Schema是否存在
* 检查数据库连接配置
* 查看中间件日志
* 确认CLS上下文是否正确设置

## 10. 未来改进方向

* 实现租户配额管理
* 添加租户数据迁移功能
* 支持动态租户隔离策略切换
* 增强租户级别的监控和日志
* 实现租户级别的备份和恢复功能
