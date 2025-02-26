import { defineConfig } from 'vitepress';

import typedocSidebar from '../api/typedoc-sidebar.json';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Aiofc Nest Server',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Build', link: '/build/index' },
      { text: 'Technologies', link: '/technologies/pnpm' },
      { text: 'Reference', link: '/reference' },
      { text: 'API', link: '/api' },
    ],

    sidebar: [
      {
        text: 'Build',
        items: [
          { text: 'index', link: '/build/index' },
          { text: 'architecture', link: '/build/architecture' },
        ],
      },
      {
        text: 'Technologies',
        items: [
          { text: 'pnpm', link: '/technologies/pnpm' },
          { text: 'git-hooks', link: '/technologies/git/git-hooks' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'VitePress', link: '/technologies/vitepress' },
          { text: 'TypeDoc', link: '/technologies/typedoc' },
          { text: 'Config', link: '/libs/config' },
          { text: 'Logger', link: '/libs/logger' },
          { text: 'i18n', link: '/libs/i18n' },
          { text: '租户数据隔离', link: '/technologies/tenant_isolation' },
        ],
      },
      {
        text: 'API',
        items: typedocSidebar,
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
});
