---
title: 认证与授权
group: Documents
category: Tutor
---

## 概述

本文档详细说明了系统的认证与授权方案，包括身份认证、权限控制、数据权限和安全审计等核心功能的设计与实现。

## 身份认证 (Authentication)

### 认证方式

1. 账号密码登录
   - 支持用户名/手机号/邮箱登录
   - 图形验证码防护
   - 记住登录状态（Remember Me）
   - 支持多端登录控制

2. 第三方登录（可选）
   - 企业微信登录
   - 钉钉登录
   - 飞书登录

### 登录安全

1. 密码安全
   - 使用 Argon2 算法加密存储
   - 密码强度要求
   - 定期修改提醒
   - 密码历史记录防止重复使用

2. 登录保护
   - 登录失败次数限制
   - 异地登录提醒
   - 登录日志记录
   - 会话超时控制

### 认证流程

1. JWT 认证机制
   - Access Token：短期令牌（2小时）
   - Refresh Token：长期令牌（7天）
   - Token 自动续期
   - 安全登出（令牌失效）

2. Session 管理
   - Redis 存储会话信息
   - 会话状态监控
   - 并发登录控制
   - 强制登出功能

## 授权管理 (Authorization)

### 角色权限模型（RBAC）

1. 角色管理
   - 系统预置角色
     - 超级管理员
     - 集团管理员
     - 公司管理员
     - 部门管理员
     - 普通用户
   - 自定义角色
   - 角色继承关系

2. 权限管理
   - 菜单权限
   - 按钮权限
   - API 权限
   - 数据权限

### 数据权限控制

1. 公司级数据隔离
   - 集团总部可查看所有数据
   - 子公司只能查看本公司数据

2. 部门级数据隔离
   - 本部门数据
   - 下属部门数据

3. 个人级数据隔离
   - 个人数据
   - 授权共享数据

### 权限分配策略

1. 基于角色的权限分配
2. 临时权限授权
3. 权限继承机制
4. 权限冲突处理

## 安全审计

### 操作日志

1. 记录内容
   - 用户登录日志
   - 重要操作记录
   - 权限变更记录
   - 敏感数据访问记录

2. 日志字段
   - 操作人
   - 操作时间
   - 操作类型
   - 操作内容
   - IP 地址
   - 设备信息

### 安全策略

1. 密码策略
   - 最小长度：8位
   - 必须包含：大小写字母、数字、特殊字符
   - 90天强制修改
   - 禁止使用前5次使用过的密码

2. 会话管理
   - 会话超时：2小时
   - 最大并发登录数：1
   - 异常登录检测
   - 强制登出功能

## 技术实现

### 后端实现

1. 认证实现

### 数据库设计

1. 用户表 (users)
   - id: uuid
   - username: string
   - password: string
   - email: string
   - phone: string
   - status: enum
   - company_id: uuid
   - department_id: uuid
   - created_at: timestamp
   - updated_at: timestamp

2. 角色表 (roles)
   - id: uuid
   - name: string
   - code: string
   - description: string
   - status: enum
   - company_id: uuid
   - created_at: timestamp
   - updated_at: timestamp

3. 权限表 (permissions)
   - id: uuid
   - name: string
   - code: string
   - type: enum
   - status: enum
   - created_at: timestamp
   - updated_at: timestamp

4. 角色权限关联表 (role_permissions)
   - role_id: uuid
   - permission_id: uuid
   - created_at: timestamp

5. 用户角色关联表 (user_roles)
   - user_id: uuid
   - role_id: uuid
   - created_at: timestamp
