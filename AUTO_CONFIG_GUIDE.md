# 🚀 自动配置生成系统使用指南

## 快速开始

### 1. 开发模式（推荐）

```bash
npm run dev:watch
```

这会同时启动：
- ✅ 文件监听（自动检测 `_NOTES` 目录变化）
- ✅ 开发服务器（VitePress）
- ✅ 自动重新生成配置

### 2. 标准开发模式

```bash
npm run dev
```

启动前会自动生成一次配置，但不会监听文件变化。

## 工作原理

```
添加/修改/删除 Markdown 文件
         ↓
    监听脚本检测到变化
         ↓
    自动扫描 _NOTES 目录
         ↓
    提取文件标题和路径
         ↓
    生成侧边栏和导航栏配置
         ↓
    VitePress 自动热更新
```

## 目录结构示例

```
docs/
└── _NOTES/
    ├── BASE/              ← 一级分类
    │   └── GIT/          ← 二级分类（侧边栏分组）
    │       └── git-survival-guide.md  ← 文章
    │
    ├── CANGJIE/
    │   └── LearnNote/
    │       └── 仓颉学习笔记.md
    │
    └── FRONTEND/         ← 新增分类会自动识别
        ├── Vue/
        │   ├── vue3-basics.md
        │   └── composition-api.md
        └── React/
            └── hooks-guide.md
```

## 添加新文章的步骤

### 方法一：使用监听模式（推荐）

1. 启动监听模式：
   ```bash
   npm run dev:watch
   ```

2. 在 `docs/_NOTES` 下创建新文件：
   ```bash
   # 例如：添加一个 Vue 教程
   docs/_NOTES/FRONTEND/Vue/vue3-basics.md
   ```

3. 编写文章内容：
   ```markdown
   ---
   title: Vue 3 基础教程
   date: 2024-12-26
   ---

   # Vue 3 基础教程

   这是内容...
   ```

4. 保存文件，配置会自动更新！✨

### 方法二：手动生成

1. 创建新文件
2. 运行生成脚本：
   ```bash
   npm run config:generate
   ```
3. 重启开发服务器

## 文章标题设置

脚本会按以下优先级提取标题：

### 1. Frontmatter（推荐）
```markdown
---
title: 这是文章标题
---
```

### 2. 第一个 # 标题
```markdown
# 这是文章标题
```

### 3. 文件名
如果以上都没有，使用文件名作为标题。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev:watch` | 开发模式 + 自动监听（推荐） |
| `npm run dev` | 标准开发模式 |
| `npm run build` | 构建生产版本 |
| `npm run config:generate` | 手动生成配置 |
| `npm run config:watch` | 仅监听文件变化 |

## 生成的配置文件

### 侧边栏配置
📁 `docs/.vitepress/sidebar/buildTools.js`

自动生成的侧边栏配置，包含所有分类和文章链接。

### 导航栏配置
📁 `docs/.vitepress/nav/index.js`

自动生成的导航栏配置，包含 Notes 下拉菜单。

## 注意事项

### ⚠️ 不要手动编辑生成的文件

以下文件会被脚本自动覆盖：
- `docs/.vitepress/sidebar/buildTools.js`
- `docs/.vitepress/nav/index.js`

如果需要自定义，请修改 `scripts/generateConfig.js`。

### ✅ 最佳实践

1. **使用 frontmatter**：为每篇文章添加 `title` 字段
2. **保持目录结构清晰**：最多 3 层目录
3. **使用有意义的文件名**：即使没有 frontmatter 也能有好的标题
4. **使用监听模式开发**：自动更新配置，无需手动操作

## 示例：添加一个新的技术分类

假设你想添加一个"数据库"分类：

1. 创建目录结构：
   ```bash
   mkdir -p docs/_NOTES/DATABASE/MySQL
   mkdir -p docs/_NOTES/DATABASE/MongoDB
   ```

2. 添加文章：
   ```bash
   # MySQL 文章
   echo "---
   title: MySQL 基础教程
   ---
   # MySQL 基础教程
   内容..." > docs/_NOTES/DATABASE/MySQL/basics.md

   # MongoDB 文章
   echo "---
   title: MongoDB 入门指南
   ---
   # MongoDB 入门指南
   内容..." > docs/_NOTES/DATABASE/MongoDB/getting-started.md
   ```

3. 如果使用监听模式，配置会自动更新！

4. 刷新浏览器，导航栏会出现 `DATABASE` 选项。

## 故障排查

### 问题：配置没有更新

**解决方案：**
1. 检查文件是否在 `docs/_NOTES` 目录下
2. 检查文件扩展名是否为 `.md`
3. 手动运行：`npm run config:generate`
4. 重启开发服务器

### 问题：标题显示不正确

**解决方案：**
1. 检查 frontmatter 格式是否正确
2. 确保文件编码为 UTF-8
3. 检查第一个 `#` 标题

### 问题：监听不工作

**解决方案：**
1. 确保依赖已安装：`npm install`
2. 重启监听脚本
3. 检查控制台是否有错误信息

## 高级配置

如果需要自定义生成规则，编辑 `scripts/generateConfig.js`：

```javascript
// 自定义分类名称格式化
function formatCategoryName(name) {
  // 你的自定义逻辑
}

// 自定义标题提取
function extractTitle(filePath) {
  // 你的自定义逻辑
}
```

详细文档请查看：`scripts/README.md`

## 总结

使用自动配置生成系统，你只需要：

1. ✅ 在 `docs/_NOTES` 下创建文件
2. ✅ 编写 Markdown 内容
3. ✅ 保存文件

配置会自动生成，无需手动维护导航栏和侧边栏！🎉
