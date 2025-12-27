<script setup>
import { randomRGB } from '../utils/color'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const titleBackground = () => `-webkit-linear-gradient(90deg, ${randomRGB()}, ${randomRGB()})`

const emit = defineEmits(['click'])
</script>

<template>
  <div
    @click="emit('click', data)"
    class="card-wrap bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl border border-zinc-200/60 dark:border-zinc-700/50 mb-6 md:mb-8 p-6 md:p-8 flex flex-col cursor-pointer group hover:border-zinc-300 dark:hover:border-zinc-600 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden"
  >
    <!-- 渐变光效 -->
    <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-100/30 dark:to-zinc-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    
    <!-- 内容区域 -->
    <div class="relative z-10">
      <p class="card-title text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4 leading-tight">
        {{ data.title }}
      </p>
      <div class="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div v-if="data.author" class="flex items-center gap-2">
          <svg class="icon-font w-4 h-4" aria-hidden="true">
            <use xlink:href="#icon-author" class="fill-zinc-500 dark:fill-zinc-400"></use>
          </svg>
          <span>{{ data.author }}</span>
        </div>
        <div v-if="data.date" class="flex items-center gap-2">
          <svg class="icon-font w-4 h-4" aria-hidden="true">
            <use xlink:href="#icon-time" class="fill-zinc-500 dark:fill-zinc-400"></use>
          </svg>
          <span>{{ data.date }}</span>
        </div>
        <div v-if="data.tags" class="flex flex-wrap items-center gap-2">
          <svg class="icon-font w-4 h-4" aria-hidden="true">
            <use xlink:href="#icon-tag" class="fill-zinc-500 dark:fill-zinc-400"></use>
          </svg>
          <div class="flex flex-wrap gap-2">
            <span 
              class="tag px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" 
              v-for="tag in data.tags" 
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-wrap {
  &:hover {
    .card-title {
      background: v-bind(titleBackground());
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      transition: all 0.3s ease;
    }
  }
}

// 卡片阴影优化 - 亮色模式
.card-wrap {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

// 暗色模式阴影 - 使用 :deep() 避免影响其他元素
:global(html.dark) .card-wrap {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
}
</style>
