const chokidar = require('chokidar')
const { exec } = require('child_process')
const path = require('path')

const NOTES_DIR = path.resolve(__dirname, '../docs/_NOTES')

console.log('👀 开始监听文件变化...')
console.log('📁 监听目录:', NOTES_DIR)
console.log('')

let isGenerating = false
let pendingRegenerate = false

function regenerateConfig() {
  if (isGenerating) {
    pendingRegenerate = true
    return
  }
  
  isGenerating = true
  console.log('🔄 检测到文件变化，重新生成配置...')
  
  exec('node scripts/generateConfig.js', (error, stdout, stderr) => {
    isGenerating = false
    
    if (error) {
      console.error('❌ 生成配置失败:', error.message)
      return
    }
    
    if (stderr) {
      console.error('⚠️  警告:', stderr)
    }
    
    console.log(stdout)
    
    // 如果在生成过程中又有变化，再次生成
    if (pendingRegenerate) {
      pendingRegenerate = false
      setTimeout(regenerateConfig, 500)
    }
  })
}

// 监听 _NOTES 目录
const watcher = chokidar.watch(NOTES_DIR, {
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件
  persistent: true,
  ignoreInitial: true,
  depth: 10
})

// 文件添加
watcher.on('add', (filePath) => {
  if (filePath.endsWith('.md')) {
    console.log(`➕ 新增文件: ${path.relative(NOTES_DIR, filePath)}`)
    regenerateConfig()
  }
})

// 文件删除
watcher.on('unlink', (filePath) => {
  if (filePath.endsWith('.md')) {
    console.log(`➖ 删除文件: ${path.relative(NOTES_DIR, filePath)}`)
    regenerateConfig()
  }
})

// 文件修改（只关注 frontmatter 中的 title 变化）
watcher.on('change', (filePath) => {
  if (filePath.endsWith('.md')) {
    console.log(`📝 修改文件: ${path.relative(NOTES_DIR, filePath)}`)
    regenerateConfig()
  }
})

// 目录添加
watcher.on('addDir', (dirPath) => {
  console.log(`📁 新增目录: ${path.relative(NOTES_DIR, dirPath)}`)
  // 目录添加不立即触发，等待文件添加
})

// 目录删除
watcher.on('unlinkDir', (dirPath) => {
  console.log(`🗑️  删除目录: ${path.relative(NOTES_DIR, dirPath)}`)
  regenerateConfig()
})

console.log('✅ 监听已启动，等待文件变化...\n')

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n👋 停止监听')
  watcher.close()
  process.exit(0)
})
