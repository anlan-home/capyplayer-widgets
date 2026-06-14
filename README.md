# TMDB + MoviePilot Widget

查询 TMDB 热门电影电视剧，联动 MoviePilot 订阅。

## 功能

| 模块 | 说明 |
|------|------|
| 热门电影 | TMDB 热门电影榜单 |
| 热门剧集 | TMDB 热门电视剧榜单 |
| 正在热映 | 当前影院上映电影 |
| 正在播出 | 当前播出电视剧 |
| 高分电影 | TMDB 高分电影 |
| 高分剧集 | TMDB 高分电视剧 |
| 即将上映 | 即将上映电影 |
| 趋势榜单 | 按日/周筛选趋势 |
| 搜索 | 搜索电影/电视剧 |

## 订阅流程

1. 浏览 TMDB 热门榜单
2. 点击条目进入详情页
3. 点击 **【订阅到 MoviePilot】** 选项
4. 自动调用 MoviePilot API 添加订阅
5. 显示订阅结果

## 安装

**Raw 地址：**
```
https://raw.githubusercontent.com/anlan-home/capyplayer-widgets/main/tmdb-moviepilot-widget.js
```

在 CapyPlayer 组件页面点击 `+`，粘贴上述地址安装。

## 配置

安装后在组件设置中配置：

| 参数 | 说明 | 示例 |
|------|------|------|
| MoviePilot 地址 | MoviePilot 服务地址 | `http://192.168.1.100:3000` |
| MoviePilot Token | API Token | 在 MoviePilot 设置 → API 中获取 |

## 电视剧订阅

对于电视剧，详情页会显示：
- **【订阅到 MoviePilot】** - 订阅整部剧
- **订阅 第N季** - 订阅指定季

## 版本历史

- **v1.2.0** - 支持在详情页直接点击订阅
- **v1.0.0** - 初始版本
