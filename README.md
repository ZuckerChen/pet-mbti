# 🐾 宠物MBTI测试

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://zuckerchen.github.io/pet-mbti/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🐱🐶 30道题，发现你家宠物的隐藏性格！

一个娱乐性质的在线宠物性格测试网站，让宠物主人通过观察宠物行为回答30道题目，系统根据**15维向量**和**曼哈顿距离算法**计算出宠物的"人格类型"，输出结果并支持社交分享。

## ✨ 特性

- 📊 **科学算法** - 15维人格模型（5模型×3维度），曼哈顿距离精准匹配
- 🎯 **25种人格** - 从"含羞草"到"六边形战士"，总有一款适合你家主子
- 📱 **一键分享** - 支持URL分享和海报下载，朋友圈晒宠神器
- 💝 **养育建议** - 每种人格都有专属的性格解读和养育建议
- 🎨 **可爱治愈** - 暖橙色治愈系设计，移动端优先的响应式布局

## 🚀 在线体验

👉 [点击开始测试](https://zuckerchen.github.io/pet-mbti/)

## 📸 预览

| 首页 | 测试页 | 结果页 |
|:---:|:---:|:---:|
| 展示测试介绍和开始按钮 | 30道题目，显示进度 | 展示人格类型和分享功能 |

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **样式**: 原生CSS变量 + Flex/Grid布局
- **算法**: 曼哈顿距离向量匹配
- **海报**: html2canvas
- **部署**: GitHub Pages

## 📁 项目结构

```
pet-mbti/
├── index.html          # 首页
├── test.html           # 测试页（30道题）
├── result.html         # 结果页
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── algorithm.js    # 匹配算法
├── data/
│   ├── dimensions.json # 15维度定义
│   ├── questions.json  # 30道题目
│   └── types.json      # 25种人格+兜底人格
└── images/
    └── types/          # 人格配图
```

## 🧮 算法说明

### 评分规则
- 每个维度由2道题组成，总分范围 2-10分
- 分级映射：2-4分→L(低)，5-7分→M(中)，8-10分→H(高)
- 数值化：L=1, M=2, H=3

### 匹配算法（曼哈顿距离）
```
用户向量与25种人格的模式串逐一计算：
distance = Σ|user[i] - type[i]|  (i=0..14)

排序规则：
1. distance 升序（距离越小越匹配）
2. exact_count 降序（相同维度越多越好）
3. similarity 降序（相似度越高越好）

similarity = 1 - distance / 30
```

### 兜底机制
当最高相似度 < 60% 时，输出兜底人格「谜之生物」

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/ZuckerChen/pet-mbti.git

# 进入目录
cd pet-mbti

# 启动本地服务器
python -m http.server 8080
```

然后访问 `http://localhost:8080`

## 📦 部署

本项目已配置 GitHub Pages，推送代码后自动部署。

## 📝 自定义内容

### 修改题目
编辑 `data/questions.json`，保持数据结构一致即可。

### 添加新的人格类型
在 `data/types.json` 的 `types` 数组中添加新的人格，code格式为 `LLL-LLL-LLL-LLL-LLL`（15个字母，每3个一组）。

### 修改样式
编辑 `css/style.css`，主要颜色变量在 `:root` 中定义。

## 📄 许可证

[MIT](LICENSE) © 2024 ZuckerChen
