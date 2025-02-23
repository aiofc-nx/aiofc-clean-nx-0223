# pnpm

## 技术需求

- ⬜ 安装 pnpm
- ⬜ 配置 pnpm
- ⬜ 配置 pnpm 镜像源
- ⬜ 配置 pnpm 缓存
- ⬜ 配置 pnpm 代理
- ⬜ 配置 pnpm 环境变量
- ⬜ 配置 pnpm 配置文件

```json
"packageManager": "pnpm@8.15.0",
"volta": {
  "node": "20.18.1"
}
```

## 创建monorepo

```bash
touch pnpm-workspace.yaml
```

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "docs/*"
```

## 配置 pnpm 镜像源

```bash
pnpm config set registry https://registry.npmmirror.com
```
