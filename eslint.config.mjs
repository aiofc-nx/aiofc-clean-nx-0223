import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules', '**/eslint.config.mjs'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  // 对测试文件放宽检查
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // 或 'off'
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: [
            'arrowFunctions', // 允许空的箭头函数
            'protected-constructors', // 允许受保护的空构造函数
            'private-constructors', // 允许私有的空构造函数
            'decoratedFunctions', // 允许带装饰器的空函数
            // 'methods',                // 允许空的类方法
            // 'constructors',           // 允许空的构造函数
            // 'functions',              // 允许空的普通函数
            // 'asyncFunctions',         // 允许空的异步函数
            // 'generatorFunctions',     // 允许空的生成器函数
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      // 配置未使用变量的检查规则
      '@typescript-eslint/no-unused-vars': [
        'error', // 违反规则时报错
        {
          args: 'all', // 检查所有函数参数
          argsIgnorePattern: '^_', // 忽略以下划线开头的参数，如 _unused
          caughtErrors: 'all', // 检查所有 catch 语句中的错误参数
          caughtErrorsIgnorePattern: '^_', // 忽略 catch 中以下划线开头的错误参数
          destructuredArrayIgnorePattern: '^_', // 忽略解构数组中以下划线开头的变量
          varsIgnorePattern: '^_', // 忽略以下划线开头的变量
          ignoreRestSiblings: true, // 忽略剩余参数中未使用的属性
        },
      ],
    },
  },
  // Any other config imports go at the top
  eslintPluginPrettierRecommended,
];
