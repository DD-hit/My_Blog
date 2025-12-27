<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const headers = ref([])
const route = useRoute()

const getHeaders = () => {
  if (typeof window === 'undefined') return
  
  const article = document.querySelector('.vp-doc')
  if (!article) return
  
  const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const result = []
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const id = heading.id
    const text = heading.textContent?.replace(/^#\s*/, '') || ''
    
    if (id && text) {
      result.push({ level, id, text })
    }
  })
  
  headers.value = result
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  setTimeout(getHeaders, 100)
})

watch(() => route.path, () => {
  setTimeout(getHeaders, 100)
})
</script>

<template>
  <div class="toc-container" v-if="headers.length > 0">
    <div class="toc-title">目录</div>
    <ul class="toc-list">
      <li
        v-for="header in headers"
        :key="header.id"
        :class="`toc-item toc-level-${header.level}`"
      >
        <a :href="`#${header.id}`" @click.prevent="scrollTo(header.id)">
          {{ header.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.toc-container {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px 20px;
  margin: 16px 0;
}

.toc-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  line-height: 1.8;
}

.toc-item a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  display: block;
}

.toc-item a:hover {
  color: var(--vp-c-brand);
}

.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 0; }
.toc-level-3 { padding-left: 16px; }
.toc-level-4 { padding-left: 32px; }
.toc-level-5 { padding-left: 48px; }
.toc-level-6 { padding-left: 64px; }
</style>
