# Git Hooks

## 需求与任务

- ⬜ git/github 初始化
- ⬜ 配置 Husky
- ⬜ 配置 Commitlint
- ⬜ 配置 Commitizen
- ⬜ 配置 Lintstaged
- ⬜ 配置 Stylelint
- ⬜ 配置 Prettier

## 什么是 Git Hooks

Git Hooks 是 Git 提供的一种机制，用于在特定事件发生时执行自定义脚本。这些事件包括提交、推送、合并等操作。Git Hooks 可以用于自动化任务、代码质量检查、代码风格检查等。

Git Hooks 类型

- `pre-commit`: 在提交之前执行，用于检查代码质量、格式化代码等。
- `pre-push`: 在推送之前执行，用于检查代码质量、格式化代码等。
- `pre-merge`: 在合并之前执行，用于检查代码质量、格式化代码等。
- `pre-rebase`: 在 rebase 之前执行，用于检查代码质量、格式化代码等。
- `pre-receive`: 在接收推送之前执行，用于检查代码质量、格式化代码等。

## 安装 Husky

```bash
npx husky-init && pnpm install
```

## 配置 Husky

```bash
npx husky add .husky/pre-commit "pnpm run lint"
npx husky add .husky/pre-push "pnpm run lint"
```

## 配置 Commitlint

```bash
npx husky add .husky/commit-msg "pnpm run commitlint"
```

## 配置 Commitizen

```bash
npm install -g commitizen  // 全局安装方便使用
```

其他依赖

```bash
pnpm add -D \
@commitlint/cli \
@commitlint/config-conventional \
@commitlint/config-nx-scopes \
commitizen cz-customizable
```

## 配置 commitlint

```bash
touch .commitlintrc.js
```

```js
// @ts-nocheck
const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  rules: {
    'scope-enum': async (ctx) => [
      2,
      'always',
      [...(await getProjects(ctx, ({ name }) => !name.includes('e2e')))],
    ],
  },
};
```

## 配置 commitizen

```bash
touch .cz.config.js
```

```js
module.exports = {
  // 可选类型
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    代码格式(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加feature，也不是修复bug)',
    },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     增加测试' },
    { value: 'chore', name: 'chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert:   回退' },
    { value: 'remove', name: 'remove:  删除模块或者项目' },
    { value: 'build', name: 'build:    打包' },
    { value: 'ci', name: 'ci:        持续集成' },
    { value: 'wip', name: 'wip:       工作进行中' },
    { value: 'hotfix', name: 'hotfix:   紧急修复' },
  ],
  // 自定义范围
  scopes: [
    { name: 'apps' },
    { name: 'libs' },
    { name: 'packages' },
    { name: 'examples' },
    { name: 'tools' },
    { name: 'monorepo' },
    { name: 'packages & examples' },
    { name: 'packages & apps' },
    { name: 'libs & examples' },
    { name: 'libs & apps' },
  ],
  // 消息步骤
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    breaking: '列出任何BREAKING CHANGES(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)',
  },
  // 跳过步骤
  skipQuestions: ['footer'],
  // subject文字长度默认是72
  subjectLimit: 100,
  // 允许自定义范围
  allowCustomScopes: true,
  // 允许BREAKING CHANGES
  allowBreakingChanges: ['feat', 'fix'],
  // 脚注前缀
  footerPrefix: 'ISSUES CLOSED:',
};

```
