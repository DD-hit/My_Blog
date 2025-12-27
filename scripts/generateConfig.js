const fs = require('fs')
const path = require('path')

// 配置
const NOTES_DIR = path.resolve(__dirname, '../docs/_NOTES')
const SIDEBAR_OUTPUT = path.resolve(__dirname, '../docs/.vitepress/sidebar/buildTools.js')
const NAV_OUTPUT = path.resolve(__dirname, '../docs/.vitepress/nav/index.js')

// 需要排除的目录
const EXCLUDE_DIRS = ['node_modules', '.vitepress', 'public', 'images']

/**
 * 递归读取目录，找到所有 .md 文件
 */
function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    
    if (item.isDirectory() && !EXCLUDE_DIRS.includes(item.name)) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir))
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath)
      files.push({
        name: item.name.replace('.md', ''),
        path: relativePath.replace(/\\/g, '/'),
        fullPath: fullPath
      })
    }
  }

  return files
}

/**
 * 从 markdown 文件中提取标题
 */
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 先尝试从 frontmatter 中提取 title
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]
      const titleMatch = frontmatter.match(/title:\s*(.+)/)
      if (titleMatch) {
        return titleMatch[1].trim().replace(/['"]/g, '')
      }
    }
    
    // 如果没有 frontmatter，尝试提取第一个 # 标题
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      return h1Match[1].trim()
    }
    
    // 如果都没有，返回文件名
    return path.basename(filePath, '.md')
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message)
    return path.basename(filePath, '.md')
  }
}

/**
 * 自动为没有 frontmatter 的文件添加 frontmatter
 */
function addFrontmatterIfNeeded(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 检查是否已有 frontmatter
    if (content.match(/^---\s*\n([\s\S]*?)\n---/)) {
      return false // 已有 frontmatter，不需要添加
    }
    
    // 提取第一个 # 标题
    const h1Match = content.match(/^#\s+(.+)$/m)
    let title = h1Match ? h1Match[1].trim() : path.basename(filePath, '.md')
    
    // 清理标题中的 Markdown 图片语法
    title = title.replace(/!\[.*?\]\(.*?\)/g, '').trim()
    
    // 如果标题包含特殊字符，用引号包裹
    const needsQuotes = /[:\[\]{}|>*&!%@^]/.test(title)
    const titleValue = needsQuotes ? `"${title.replace(/"/g, '\\"')}"` : title
    
    // 生成 frontmatter
    const today = new Date().toISOString().split('T')[0]
    const frontmatter = `---
title: ${titleValue}
date: ${today}
tags: []
categories: [技术笔记]
---

`
    
    // 添加 frontmatter
    const newContent = frontmatter + content
    fs.writeFileSync(filePath, newContent, 'utf-8')
    
    console.log(`  ✨ 已添加 frontmatter: ${path.relative(NOTES_DIR, filePath)}`)
    return true
  } catch (error) {
    console.error(`  ❌ 添加 frontmatter 失败: ${filePath}`, error.message)
    return false
  }
}

/**
 * 生成侧边栏配置
 */
function generateSidebarConfig() {
  const categories = {}
  
  // 读取 _NOTES 目录下的所有一级目录
  const topDirs = fs.readdirSync(NOTES_DIR, { withFileTypes: true })
    .filter(item => item.isDirectory() && !EXCLUDE_DIRS.includes(item.name))
  
  for (const topDir of topDirs) {
    const categoryPath = path.join(NOTES_DIR, topDir.name)
    const files = getAllMarkdownFiles(categoryPath, NOTES_DIR)
    
    if (files.length === 0) continue
    
    // 按子目录分组
    const grouped = {}
    for (const file of files) {
      const parts = file.path.split('/')
      const subCategory = parts.length > 2 ? parts[1] : topDir.name
      
      if (!grouped[subCategory]) {
        grouped[subCategory] = []
      }
      
      const title = extractTitle(file.fullPath)
      grouped[subCategory].push({
        text: title,
        link: `/_NOTES/${file.path.replace('.md', '')}`
      })
    }
    
    // 生成该分类的侧边栏
    const sidebarItems = Object.entries(grouped).map(([subCat, items]) => ({
      text: formatCategoryName(subCat),
      collapsible: true,
      items: items
    }))
    
    categories[topDir.name] = {
      path: `/_NOTES/${topDir.name}/`,
      items: sidebarItems
    }
  }
  
  return categories
}

/**
 * 格式化分类名称
 */
function formatCategoryName(name) {
  // 将驼峰或下划线转换为空格分隔的标题
  const formatted = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
  
  // 首字母大写
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

/**
 * 生成导航栏配置
 */
function generateNavConfig(categories) {
  const navItems = []
  
  for (const [categoryName, config] of Object.entries(categories)) {
    // 获取该分类下的第一个文件作为默认链接
    const firstItem = config.items[0]?.items[0]
    if (firstItem) {
      navItems.push({
        text: categoryName.toUpperCase(),
        link: firstItem.link
      })
    }
  }
  
  return navItems
}

/**
 * 写入侧边栏配置文件
 */
function writeSidebarConfig(categories) {
  // 检查文件是否存在
  let existingContent = ''
  let hasCustomContent = false
  
  if (fs.existsSync(SIDEBAR_OUTPUT)) {
    existingContent = fs.readFileSync(SIDEBAR_OUTPUT, 'utf-8')
    // 检查是否有自定义内容（不是自动生成的）
    hasCustomContent = !existingContent.includes('// 此文件由 scripts/generateConfig.js 自动生成')
  }
  
  if (hasCustomContent) {
    console.log('⚠️  侧边栏配置包含自定义内容，跳过生成')
    return
  }
  
  let content = '// 此文件由 scripts/generateConfig.js 自动生成\n\n'
  
  // 生成每个分类的侧边栏变量
  for (const [categoryName, config] of Object.entries(categories)) {
    const varName = `${categoryName.toLowerCase()}Sidebar`
    content += `const ${varName} = ${JSON.stringify(config.items, null, 2)}\n\n`
  }
  
  // 生成导出对象
  content += 'module.exports = {\n'
  for (const [categoryName, config] of Object.entries(categories)) {
    const varName = `${categoryName.toLowerCase()}Sidebar`
    content += `  '${config.path}': ${varName},\n`
  }
  content += '}\n'
  
  fs.writeFileSync(SIDEBAR_OUTPUT, content, 'utf-8')
  console.log('✅ 侧边栏配置已生成:', SIDEBAR_OUTPUT)
}

/**
 * 写入导航栏配置文件
 */
function writeNavConfig(navItems) {
  // 检查文件是否存在
  let existingContent = ''
  let hasCustomContent = false
  
  if (fs.existsSync(NAV_OUTPUT)) {
    existingContent = fs.readFileSync(NAV_OUTPUT, 'utf-8')
    // 检查是否有自定义内容（不是自动生成的）
    hasCustomContent = !existingContent.includes('// 此文件由 scripts/generateConfig.js 自动生成')
  }
  
  if (hasCustomContent) {
    console.log('⚠️  导航栏配置包含自定义内容，跳过生成')
    return
  }
  
  let content = '// 此文件由 scripts/generateConfig.js 自动生成\n\n'
  content += 'const nav = [\n'
  content += '  {\n'
  content += '    text: \'Notes\',\n'
  content += '    items: [\n'
  
  for (const item of navItems) {
    content += `      { text: '${item.text}', link: '${item.link}' },\n`
  }
  
  content += '    ],\n'
  content += '  },\n'
  content += '  {\n'
  content += '    text: \'Posts\',\n'
  content += '    items: [\n'
  content += '      { text: \'Timeline\', link: \'/timeline\' },\n'
  content += '      { text: \'Categories\', link: \'/category\' },\n'
  content += '      { text: \'Tags\', link: \'/tag\' },\n'
  content += '    ],\n'
  content += '  },\n'
  content += ']\n\n'
  content += 'export default nav\n'
  
  fs.writeFileSync(NAV_OUTPUT, content, 'utf-8')
  console.log('✅ 导航栏配置已生成:', NAV_OUTPUT)
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始生成配置...\n')
  
  // 检查 _NOTES 目录是否存在
  if (!fs.existsSync(NOTES_DIR)) {
    console.error('❌ _NOTES 目录不存在:', NOTES_DIR)
    process.exit(1)
  }
  
  // 询问是否自动添加 frontmatter
  console.log('📝 检查并添加缺失的 frontmatter...')
  const files = getAllMarkdownFiles(NOTES_DIR)
  let addedCount = 0
  for (const file of files) {
    if (addFrontmatterIfNeeded(file.fullPath)) {
      addedCount++
    }
  }
  if (addedCount > 0) {
    console.log(`\n✨ 已为 ${addedCount} 个文件添加 frontmatter\n`)
  } else {
    console.log('✅ 所有文件都已有 frontmatter\n')
  }
  
  // 生成侧边栏配置
  const categories = generateSidebarConfig()
  writeSidebarConfig(categories)
  
  // 生成导航栏配置
  const navItems = generateNavConfig(categories)
  writeNavConfig(navItems)
  
  console.log('\n✨ 配置生成完成！')
  console.log('\n📊 统计信息:')
  console.log(`   - 分类数量: ${Object.keys(categories).length}`)
  console.log(`   - 导航项数量: ${navItems.length}`)
  
  let totalFiles = 0
  for (const config of Object.values(categories)) {
    for (const group of config.items) {
      totalFiles += group.items.length
    }
  }
  console.log(`   - 文件总数: ${totalFiles}`)
}

// 运行
main()
