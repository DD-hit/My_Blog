import DefaultTheme from 'vitepress/theme'
import MochiLayout from './components/MochiLayout.vue'
import Mermaid from './components/Mermaid.vue'
import Toc from './components/Toc.vue'
import './css/index.css'
import './assets/fonts/source-code-pro/source-code-pro.css'
import './assets/fonts/source-code-pro/source-code-variable.css'
import './css/custom.css'
import './css/tailwind.css'
import 'viewerjs/dist/viewer.css'
import 'katex/dist/katex.min.css'
import '../../drake-juejin.css'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
// v-viewer 不支持 SSR, 所以改了一份放在 utils 下面
import VueViewer from './utils/v-viewer-ssr'

// 蓝黑色调主题配置
const darkBlueTheme = {
  primaryColor: '#1e3a5f',
  primaryTextColor: '#e8f4fc',
  primaryBorderColor: '#3b82f6',
  lineColor: '#3b82f6',
  secondaryColor: '#1b4965',
  tertiaryColor: '#0d3b66',
  background: '#0d1b2a',
  mainBkg: '#1b2838',
  nodeBorder: '#3b82f6',
  clusterBkg: '#162635',
  clusterBorder: '#3b82f6',
  titleColor: '#e8f4fc',
  edgeLabelBackground: '#1b2838',
  textColor: '#e8f4fc',
  nodeTextColor: '#e8f4fc',
  actorBkg: '#1e3a5f',
  actorBorder: '#3b82f6',
  actorTextColor: '#e8f4fc',
  actorLineColor: '#3b82f6',
  noteBkgColor: '#1b4965',
  noteBorderColor: '#5eadd8',
  noteTextColor: '#e8f4fc',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
}

const lightBlueTheme = {
  primaryColor: '#dbeafe',
  primaryTextColor: '#1e3a5f',
  primaryBorderColor: '#3b82f6',
  lineColor: '#3b82f6',
  secondaryColor: '#e0f2fe',
  tertiaryColor: '#f0f9ff',
  background: '#f8fafc',
  mainBkg: '#eff6ff',
  nodeBorder: '#3b82f6',
  clusterBkg: '#f0f9ff',
  clusterBorder: '#3b82f6',
  titleColor: '#1e3a5f',
  edgeLabelBackground: '#eff6ff',
  textColor: '#1e3a5f',
  nodeTextColor: '#1e3a5f',
  actorBkg: '#dbeafe',
  actorBorder: '#3b82f6',
  actorTextColor: '#1e3a5f',
  actorLineColor: '#3b82f6',
  noteBkgColor: '#fef3c7',
  noteBorderColor: '#f59e0b',
  noteTextColor: '#1e3a5f',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
}

// Mermaid 初始化函数
const initMermaid = async () => {
  if (typeof window === 'undefined') return
  
  // 查找所有 mermaid 代码块容器
  const containers = document.querySelectorAll('.vp-doc div[class*="language-mermaid"]')
  if (containers.length === 0) return
  
  const isDark = document.documentElement.classList.contains('dark')
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: isDark ? darkBlueTheme : lightBlueTheme,
    securityLevel: 'loose',
  })
  
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i]
    if (container.dataset.mermaidRendered) continue
    
    // 获取 code 元素内的所有 .line span 的文本
    const lines = container.querySelectorAll('code .line')
    let code = ''
    lines.forEach(line => {
      code += line.textContent + '\n'
    })
    code = code.trim()
    
    if (!code) continue
    
    const id = `mermaid-${Date.now()}-${i}`
    
    try {
      const { svg } = await mermaid.render(id, code)
      container.dataset.mermaidRendered = 'true'
      
      // 创建带缩放控制的容器
      const controls = `
        <div class="mermaid-controls">
          <button data-action="zoomOut" title="缩小">−</button>
          <button data-action="reset" title="重置">100%</button>
          <button data-action="zoomIn" title="放大">+</button>
          <button data-action="fullscreen" title="全屏">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>
      `
      container.innerHTML = `${controls}<div class="mermaid-wrapper" data-scale="1">${svg}</div>`
      
      // 添加缩放事件
      const wrapper = container.querySelector('.mermaid-wrapper')
      let scale = 1
      
      // 拖拽和位移变量
      let translateX = 0, translateY = 0
      let isFullscreen = false
      
      const updateTransform = () => {
        wrapper.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`
        container.querySelector('[data-action="reset"]').textContent = `${Math.round(scale * 100)}%`
      }
      
      const toggleFullscreen = () => {
        isFullscreen = !isFullscreen
        container.classList.toggle('mermaid-fullscreen', isFullscreen)
        document.body.style.overflow = isFullscreen ? 'hidden' : ''
        const btn = container.querySelector('[data-action="fullscreen"]')
        btn.innerHTML = isFullscreen 
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`
      }
      
      // ESC 退出全屏
      const handleKeydown = (e) => {
        if (e.key === 'Escape' && isFullscreen) toggleFullscreen()
      }
      document.addEventListener('keydown', handleKeydown)
      
      container.querySelectorAll('.mermaid-controls button').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action
          if (action === 'zoomIn') scale = Math.min(scale + 0.2, 3)
          else if (action === 'zoomOut') scale = Math.max(scale - 0.2, 0.4)
          else if (action === 'reset') {
            scale = 1
            translateX = 0
            translateY = 0
          } else if (action === 'fullscreen') {
            toggleFullscreen()
            return
          }
          updateTransform()
        })
      })
      
      // 鼠标滚轮缩放
      container.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
          e.preventDefault()
          scale = e.deltaY < 0 ? Math.min(scale + 0.1, 3) : Math.max(scale - 0.1, 0.4)
          updateTransform()
        }
      }, { passive: false })
      
      // 拖拽移动
      let isDragging = false
      let startX = 0, startY = 0
      
      wrapper.addEventListener('mousedown', (e) => {
        isDragging = true
        startX = e.clientX - translateX
        startY = e.clientY - translateY
        wrapper.style.cursor = 'grabbing'
      })
      
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return
        e.preventDefault()
        translateX = e.clientX - startX
        translateY = e.clientY - startY
        updateTransform()
      })
      
      document.addEventListener('mouseup', () => {
        isDragging = false
        wrapper.style.cursor = 'grab'
      })
    } catch (e) {
      console.error('Mermaid render error:', e)
    }
  }
}

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    // extend default theme custom behaviour.
    ctx.app.use(VueViewer)
    ctx.app.component('Mermaid', Mermaid)
    ctx.app.component('Toc', Toc)
    DefaultTheme.enhanceApp(ctx)
  },
  setup() {
    const route = useRoute()
    
    // 图片缩放
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }
    
    onMounted(() => {
      initZoom()
      initMermaid()
    })
    
    watch(
      () => route.path,
      () => nextTick(() => {
        initZoom()
        initMermaid()
      })
    )
  },
  Layout: MochiLayout,
}
