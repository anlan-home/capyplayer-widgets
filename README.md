# TMDB + MoviePilot Widget 使用说明

## 功能介绍

这是一个为 CapyPlayer 开发的 Widget，支持：

1. **TMDB 榜单查询**
   - 热门电影 / 热门剧集
   - 正在热映 / 正在播出
   - 高分电影 / 高分剧集
   - 即将上映
   - 趋势榜单（今日/本周）

2. **TMDB 搜索**
   - 支持搜索电影、电视剧或全部

3. **MoviePilot 订阅联动**
   - 在详情页自动调用 MoviePilot API 添加订阅
   - 支持通过 TMDB ID 快速订阅

## 安装方法

### 方法一：本地文件安装

1. 将 `tmdb-moviepilot-widget.js` 文件托管到可公开访问的 URL（如 GitHub Raw、Gist 等）

2. 在 CapyPlayer 中进入「组件」页面

3. 点击右上角 `+` 按钮

4. 粘贴 Widget 脚本的 URL

5. 预览后点击安装

### 方法二：Deep Link 安装

使用以下格式的 Deep Link 一键安装：

```
com.feifeiduck.capyplayer://add-widget?data=<base64url编码的脚本URL>
```

## 配置说明

安装后需要在组件设置中配置以下参数：

### 必填参数

| 参数 | 说明 | 示例 |
|------|------|------|
| MoviePilot 地址 | MoviePilot 服务地址 | `http://192.168.1.100:3000` |
| MoviePilot Token | API 认证令牌 | 在 MoviePilot 设置 -> API 中获取 |

### 可选参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| 语言 | TMDB 数据语言 | `zh-CN` |

## 获取 MoviePilot Token

1. 登录 MoviePilot Web 界面

2. 进入「设置」->「系统」->「API」

3. 复制 API Token

## 使用方法

### 浏览榜单

1. 打开 CapyPlayer，进入「组件」页面

2. 选择「TMDB + MoviePilot」组件

3. 选择想要浏览的榜单（热门电影、热门剧集等）

4. 点击条目进入详情页

### 订阅到 MoviePilot

1. 在详情页，如果已配置 MoviePilot 地址和 Token

2. 系统会自动尝试调用 MoviePilot API 添加订阅

3. 订阅结果会显示在详情页的描述信息中

### 通过 TMDB ID 订阅

1. 在组件中选择「MP 订阅」模块

2. 输入 TMDB ID（如：572802）

3. 选择媒体类型（电影/电视剧）

4. 点击搜索，进入详情页完成订阅

## 模块说明

| 模块 | 说明 |
|------|------|
| 热门电影 | TMDB 热门电影榜单 |
| 热门剧集 | TMDB 热门电视剧榜单 |
| 正在热映 | 当前正在影院上映的电影 |
| 正在播出 | 当前正在播出的电视剧 |
| 高分电影 | TMDB 高分电影榜单 |
| 高分剧集 | TMDB 高分电视剧榜单 |
| 即将上映 | 即将上映的电影 |
| 趋势榜单 | TMDB 趋势榜单（支持按日/周筛选） |
| 搜索 | 搜索 TMDB 电影/电视剧 |
| MP 订阅 | 通过 TMDB ID 快速订阅到 MoviePilot |

## 常见问题

### Q: 订阅失败怎么办？

A: 请检查：
1. MoviePilot 地址是否正确（包含端口号）
2. Token 是否有效
3. MoviePilot 服务是否正常运行
4. 网络是否可达

### Q: 如何获取 TMDB ID？

A: 
1. 在 TMDB 网站（themoviedb.org）搜索电影/电视剧
2. URL 中的数字即为 TMDB ID
3. 例如：`https://www.themoviedb.org/movie/572802` 中，TMDB ID 为 `572802`

### Q: 支持豆瓣数据吗？

A: 当前版本仅支持 TMDB。豆瓣 API 需要申请 Key，且有限流限制，暂未支持。

## 更新日志

### v1.0.0
- 初始版本
- 支持 TMDB 榜单查询
- 支持 MoviePilot 订阅联动
