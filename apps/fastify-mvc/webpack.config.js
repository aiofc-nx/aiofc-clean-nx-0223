const { join } = require('path');

const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/fastify-mvc'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
