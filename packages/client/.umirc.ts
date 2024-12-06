import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '数据库多方言查询系统',
  },
  routes: [
    {
      path: '/',
      redirect: '/query',
    },
    {
      name: '多方言查询生成',
      path: '/query',
      component: './Query',
    },
    {
      name: '数据库配置',
      path: '/data-source',
      component: './DataSource',
    }
  ],
  npmClient: 'pnpm',

  plugins: [require.resolve('@umijs/plugins/dist/unocss')],
  unocss: {
    // 检测 className 的文件范围，若项目不包含 src 目录，可使用 `pages/**/*.tsx`
    watch: ['src/**/*.tsx'],
  },
});
