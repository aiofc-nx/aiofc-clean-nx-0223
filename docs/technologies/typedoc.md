# TypeDoc

TypeDoc 是一个用于生成 TypeScript 代码的文档的工具。

## 集成vitepress

关键点：

1. 使用 `typedoc-vitepress-theme` 插件：为输出的 markdown 文件添加 vitepress 的导航栏
2. 使用 `typedoc-plugin-markdown` 插件：以 markdown 格式输出
3. 使用(选用) `typedoc-plugin-merge-modules` 插件：合并模块

在文档的管理上，vitepress和typedoc它们依然是分开的，typedoc 只负责生成 markdown 文件，vitepress 负责将 markdown 文件转换为 html 文件。各自的操作按各自的官网介绍进行，集成的关键点是生成一个markdown文件的目录，这个目录文件是 `typedoc-sidebar.json`，它描述了markdown文件的目录结构，vitepress 会根据这个目录结构生成导航栏。

`typedoc-vitepress-theme` 插件的作用就是生成 `typedoc-sidebar.json` 文件。

这里需要注意一个配置问题，`typedoc-vitepress-theme` 插件的 `docsRoot` 配置需要和 `out` 配置的一起使用，`out` 配置的是 markdown 文件的输出目录，`docsRoot` 配置的`vitepress` 项目的目录，否则生成的 `typedoc-sidebar.json` 文件会出现链接的路径错误，导致找不到对应的 markdown 文件。

```json
{
  "out": "./docs/api",
  "docsRoot": "./docs",
  "plugin": ["typedoc-plugin-markdown", "typedoc-vitepress-theme"]
}

```
