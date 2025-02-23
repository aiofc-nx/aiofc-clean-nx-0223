# Build

## Create Nx Workspace

```bash
npx create-nx-workspace --pm pnpm
```

## tsconfig

```json
{
  "compilerOptions": {
    "module": "commonjs", // 使用 CommonJS 模块系统
    "target": "es2022", // 编译目标为 ES2022
    "lib": ["es2022", "dom"], // 使用 ES2022 和 DOM 的库
    "composite": true, // 启用复合项目
    "declaration": false, // 不生成声明文件
    "esModuleInterop": true, // 启用 ES 模块互操作性
    "forceConsistentCasingInFileNames": true, // 强制文件名一致性
    "strict": true, // 启用严格类型检查
    "skipLibCheck": true, // 跳过库文件检查
    "removeComments": true, // 移除注释
    "declarationMap": true, // 生成声明映射文件
    "sourceMap": true, // 生成源映射文件
    "moduleResolution": "node", // 使用 Node 模块解析策略
    "resolveJsonModule": true, // 允许导入 JSON 模块
    "emitDecoratorMetadata": true, // 生成装饰器的元数据
    "experimentalDecorators": true, // 启用实验性装饰器
    "importHelpers": true, // 启用帮助函数的导入
    "skipDefaultLibCheck": true, // 跳过默认库检查
    "baseUrl": ".", // 基础 URL 设置为当前目录
    "rootDir": ".", // 根目录设置为当前目录
  }
}

```

:::warning

* 务必修改 `tsconfig.base.json` ，然后才能安装@nx/nest，否则会影响到生成nestjs项目的`tsconfig.json`的配置。
* 特别是关于路径定位的那些配置项。

:::

## Create NestJS Project

```bash
npx create-nx-workspace --pm pnpm
```
