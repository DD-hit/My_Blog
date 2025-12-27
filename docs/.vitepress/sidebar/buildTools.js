// 此文件由 scripts/generateConfig.js 自动生成

const markdownSidebar = [
  {
    "text": "Md",
    "collapsible": true,
    "items": [
      {
        "text": "Markdown文本样式",
        "link": "/_NOTES/MARKDOWN/md/markdown语法测试集合"
      }
    ]
  }
]

const othersSidebar = [
  {
    "text": "O T H E R S",
    "collapsible": true,
    "items": [
      {
        "text": "正向代理和反向代理",
        "link": "/_NOTES/OTHERS/正、反向代理"
      }
    ]
  }
]

const ros2Sidebar = [
  {
    "text": "Ros Notes",
    "collapsible": true,
    "items": [
      {
        "text": "多点巡航（默认已建好图）",
        "link": "/_NOTES/ROS2/RosNotes/多点巡航（默认已建好图）"
      }
    ]
  }
]

const 大数据Sidebar = [
  {
    "text": "大数据",
    "collapsible": true,
    "items": [
      {
        "text": "Key Commands",
        "link": "/_NOTES/大数据/Key Commands"
      },
      {
        "text": "银行流水实时分析系统大作业方案",
        "link": "/_NOTES/大数据/方案"
      }
    ]
  }
]

module.exports = {
  '/_NOTES/MARKDOWN/': markdownSidebar,
  '/_NOTES/OTHERS/': othersSidebar,
  '/_NOTES/ROS2/': ros2Sidebar,
  '/_NOTES/大数据/': 大数据Sidebar,
}
