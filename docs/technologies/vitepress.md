# 使用 vitepress 搭建文档

## 技术要求

- ✅ vitepress 文档项目初始化

- ⬜ 引入`markdownlint`语法检查

- ⬜ 适配TypeDoc

## 安装 vitepress

```bash
npm install vitepress --save-dev
```

## 初始化

```bash
npx vitepress init
```

脚手架会帮我们创建一个默认的文档目录结构，我们只需要在 `docs` 目录下创建我们的文档即可。
同时，在 `package.json` 中会自动添加 `docs:dev` 和 `docs:build` 两个脚本。

```json
"scripts": {
  "docs:dev": "vitepress dev docs",
  "docs:build": "vitepress build docs",
  "docs:preview": "vitepress preview docs"
}
```
