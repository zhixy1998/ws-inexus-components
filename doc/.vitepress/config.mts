import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vue3-lib-template-doc",
  description: "vue3 组件库文档模板",
  outDir: "./lib",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: '简介', link: '/intro'},
      {text: '快速开始', link: '/start'},
      { text: '组件', link: '/components' }
    ],

    sidebar: [
      {text: '简介', link: '/intro'},
      {text: '快速开始', link: '/start'},
      {text: '打包发布', link: '/publish'},
      {
        text: '组件',
        items: [
          { text: '折线图', link: '/components/ws-lines-chart' } // 折线图子项
        ]
      }
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/Maylisten/vue3-lib-template'}
    ]
  },
  base: "/vue3-lib-template",
})
