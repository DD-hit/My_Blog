# 自动配置生成脚本

## 功能说明

这些脚本可以自动扫描 `docs/_NOTES` 目录，根据文件结构自动生成导航栏和侧边栏配置。

## 脚本文件

### 1. `generateConfig.js`
一次性生成配置文件。

**功能：**
- 扫描 `docs/_NOTES` 目录下的所有 Markdown 文件
- 从文件的 frontmatter 或第一个 `#` 标题中提取标题
- 自动生成侧边栏配置（`docs/.vitepress/sidebar/buildTools.js`）
- 自动生成导航栏配置（`docs/.vitepress/nav/index.js`）

**使用方法：**
```bash
npm run config:generate
```

### 2. `watchConfig.js`
监听文件变化，自动重新生成配置。

**功能：**
- 监听 `docs/_NOTES` 目录的文件变化
- 当添加、删除、修改 Markdown 文件时自动重新生成配置
- 当添加、删除目录时自动重新生成配置

**使用方法：**
```bash
npm run config:watch
```

## NPM 脚本命令

### 开发模式

#### 标准开发模式
```bash
npm run dev
```
启动前会自动生成一次配置，然后启动开发服务器。

#### 监听模式（推荐）
```bash
npm run dev:watch
```
同时启动配置监听和开发服务器，文件变化时自动更新配置。

### 构建模式
```bash
npm run build
```
构建前会自动生成一次配置。

### 仅生成配置
```bash
npm run config:generate
```
只生成配置文件，不启动服务器。

### 仅监听配置
```bash
npm run config:watch
```
只监听文件变化并生成配置，不启动服务器。

## 目录结构要求

脚本会扫描以下结构：

```
docs/
└── _NOTES/
    ├── BASE/
    │   └── GIT/
    │       └── git-survival-guide.md
    ├── CANGJIE/
    │   └── LearnNote/
    │       └── 仓颉学习笔记.md
    ├── MARKDOWN/
    │   └── md/
    │       └── markdown语法测试集合.md
    └── SPIRE/
        └── SpireNote/
            ├── 依赖注入.md
            ├── 配置.md
            └── 选项.md
```

## 配置规则

### 侧边栏生成规则

1. **一级目录**：`_NOTES` 下的每个目录（如 `BASE`、`CANGJIE`）会生成一个独立的侧边栏配置
2. **二级目录**：作为侧边栏的分组标题（如 `GIT`、`LearnNote`）
3. **Markdown 文件**：作为侧边栏的链接项

### 导航栏生成规则

1. 每个一级目录会在导航栏的 `Notes` 下拉菜单中生成一个链接
2. 链接指向该分类下的第一个文件

### 标题提取规则

脚本会按以下优先级提取文章标题：

1. **Frontmatter 中的 title**（最高优先级）
   ```markdown
   ---
   title: Git 生存指南
   ---
   ```

2. **第一个 # 标题**
   ```markdown
   # Git 生存指南
   ```

3. **文件名**（最低优先级）
   如果以上都没有，使用文件名作为标题

## 排除规则

以下目录会被自动排除：
- `node_modules`
- `.vitepress`
- `public`
- `images`

## 生成的文件

### `docs/.vitepress/sidebar/buildTools.js`
```javascript
// 此文件由 scripts/generateConfig.js 自动生成

const baseSidebar = [
  {
    "text": "G I T",
    "collapsible": true,
    "items": [
      {
        "text": "Git 生存指南：15 个让你不再手抖的核心命令",
        "link": "/_NOTES/BASE/GIT/git-survival-guide"
      }
    ]
  }
]

module.exports = {
  '/_NOTES/BASE/': baseSidebar,
  // ...
}
```

### `docs/.vitepress/nav/index.js`
```javascript
// 此文件由 scripts/generateConfig.js 自动生成

const nav = [
  {
    text: 'Notes',
    items: [
      { text: 'BASE', link: '/_NOTES/BASE/GIT/git-survival-guide' },
      // ...
    ],
  },
  {
    text: 'Posts',
    items: [
      { text: 'Timeline', link: '/timeline' },
      { text: 'Categories', link: '/category' },
      { text: 'Tags', link: '/tag' },
    ],
  },
]

export default nav
```

## 注意事项

1. **不要手动编辑生成的文件**：`buildTools.js` 和 `nav/index.js` 会被脚本覆盖
2. **Frontmatter 格式**：确保 Markdown 文件的 frontmatter 格式正确
3. **文件命名**：建议使用有意义的文件名，因为它可能被用作标题
4. **目录结构**：保持 `_NOTES` 下的目录结构清晰，最多建议 3 层

## 故障排查

### 配置没有更新？
1. 检查文件是否在 `docs/_NOTES` 目录下
2. 检查文件扩展名是否为 `.md`
3. 尝试手动运行 `npm run config:generate`
4. 重启开发服务器

### 标题显示不正确？
1. 检查 frontmatter 中的 `title` 字段
2. 检查第一个 `#` 标题是否正确
3. 确保文件编码为 UTF-8

### 监听不工作？
1. 确保 `chokidar` 已安装：`npm install`
2. 检查是否有权限访问 `_NOTES` 目录
3. 尝试重启监听脚本

## 扩展

如果需要自定义配置生成规则，可以修改 `scripts/generateConfig.js` 中的以下函数：

- `formatCategoryName()` - 自定义分类名称格式化
- `extractTitle()` - 自定义标题提取逻辑
- `generateSidebarConfig()` - 自定义侧边栏生成规则
- `generateNavConfig()` - 自定义导航栏生成规则
