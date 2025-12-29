import { defineConfig } from 'vitepress'
import nav from './nav'
import getPages from '../../helper/getPages'
import getSidebarConfig from './sidebar'
import markdownItMark from 'markdown-it-mark'
import { katex } from '@mdit/plugin-katex'
import markdownItTaskLists from 'markdown-it-task-lists'
import markdownItFootnote from 'markdown-it-footnote'
import { full as emoji } from 'markdown-it-emoji'
import markdownItSub from 'markdown-it-sub'
import markdownItSup from 'markdown-it-sup'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItAttrs from 'markdown-it-attrs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 加载仓颉语言语法
const cangjieGrammar = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './theme/languages/cangjie/cangjie.tmLanguage.json'), 'utf-8')
)

// 加载仓颉主题
const cangjieThemeDark = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './theme/languages/cangjie/cangjie-theme-dark.json'), 'utf-8')
)
const cangjieThemeLight = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './theme/languages/cangjie/cangjie-theme-light.json'), 'utf-8')
)

const config = async () => {
  const sidebar = await getSidebarConfig() // 生成 sidebar 配置
  await getPages()

  const themeConfig = {
    logo: { light: '/logo-light.png', dark: '/logo-dark.png' }, // 主页 logo
    siteTitle: false, // 主页标题, 设置为 false 可不显示
    nav,
    sidebar,
    outlineTitle: '大纲', // 大纲标题
    outline: [2, 3], // 大纲层级
    lastUpdatedText: '上次更新时间',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    editLink: {
      // pattern: 'https://github.com/', // 编辑链接
      pattern: '', // 编辑链接
      text: '编辑此页',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    // algolia: {
    //   // 搜索功能
    //   apiKey: 'your_api_key',
    //   indexName: 'index_name',
    // },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    footer: {
      message: "DD's Cangjie Learn Notes.",
      copyright: 'Copyright © 2025-present DD',
    },
  }

  return defineConfig({
    base: '/', // 基础路径
    title: 'DD', // 网页标题
    titleTemplate: 'Blog',
    description: "DD's personal blog.", // 描述
    head: [
      ['link', { rel: 'icon', href: '/vitepress-theme-mochi/logo128.png' }]
    ],
    lastUpdated: true, // 开启最近更新时间
    ignoreDeadLinks: true, // 忽略无效链接
    outDir: '../dist', // 输出目录
    markdown: {
      lineNumbers: true,
      config: (md) => {
        md.use(markdownItMark)
        md.use(katex, { strict: false })
        md.use(markdownItTaskLists)
        md.use(markdownItFootnote)
        md.use(emoji)
        md.use(markdownItSub)
        md.use(markdownItSup)
        md.use(markdownItAbbr)
        md.use(markdownItAttrs)
      },
      languages: [cangjieGrammar],
      theme: {
        light: cangjieThemeLight,
        dark: cangjieThemeDark
      }
    },
    themeConfig,
  })
}

export default config
