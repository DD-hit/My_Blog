<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const container = ref(null)
const { isDark } = useData()
const isFullscreen = ref(false)

// 蓝黑色调主题
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

const renderChart = async () => {
  if (typeof window === 'undefined' || !container.value) return
  
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: isDark.value ? darkBlueTheme : lightBlueTheme,
    securityLevel: 'loose',
  })
  
  const id = `mermaid-${Date.now()}`
  try {
    const { svg } = await mermaid.render(id, props.code)
    container.value.innerHTML = svg
  } catch (e) {
    container.value.innerHTML = `<pre style="color: red;">Mermaid Error: ${e.message}</pre>`
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  document.body.style.overflow = isFullscreen.value ? 'hidden' : ''
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) toggleFullscreen()
}

onMounted(() => {
  renderChart()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(isDark, renderChart)
</script>

<template>
  <div class="mermaid-wrapper" :class="{ 'is-fullscreen': isFullscreen }">
    <button class="fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏显示'">
      <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
      </svg>
    </button>
    <div ref="container" class="mermaid-container"></div>
  </div>
</template>

<style scoped>
.mermaid-wrapper {
  position: relative;
}

.mermaid-container {
  text-align: center;
  padding: 1rem 0;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.mermaid-container::-webkit-scrollbar {
  display: none;
}

.fullscreen-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mermaid-wrapper:hover .fullscreen-btn {
  opacity: 1;
}

.fullscreen-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-mute);
}

.is-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
}

.is-fullscreen .mermaid-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.is-fullscreen .fullscreen-btn {
  opacity: 1;
  top: 16px;
  right: 16px;
}

.is-fullscreen :deep(svg) {
  max-width: 95vw;
  max-height: 90vh;
}
</style>
