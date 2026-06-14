/**
 * TMDB + MoviePilot Widget
 * 查询 TMDB 热门电影/电视剧，并支持 MoviePilot 订阅联动
 * 
 * 功能：
 * 1. TMDB 热门电影/电视剧榜单
 * 2. TMDB 搜索功能
 * 3. MoviePilot 订阅联动（在详情页显示订阅信息）
 */

var WidgetMetadata = {
    id: "tmdb-moviepilot",
    title: "TMDB + MoviePilot",
    description: "查询 TMDB 热门电影电视剧，联动 MoviePilot 订阅",
    version: "1.0.0",
    author: "CapyPlayer User",
    site: "https://www.themoviedb.org",
    icon: "https://www.themoviedb.org/assets/2/apple-touch-icon-cfba7699efe7a742de25c28e08c4ec25.png",
    globalParams: [
        {
            name: "language",
            type: "language",
            label: "语言",
            defaultValue: "zh-CN"
        },
        {
            name: "mp_url",
            type: "string",
            label: "MoviePilot 地址",
            description: "例如: http://192.168.1.100:3000",
            defaultValue: ""
        },
        {
            name: "mp_token",
            type: "string",
            label: "MoviePilot Token",
            description: "在 MoviePilot 设置 -> API 中获取",
            defaultValue: ""
        }
    ],
    modules: [
        {
            id: "popular_movies",
            title: "热门电影",
            type: "media_list",
            functionName: "getPopularMovies",
            description: "TMDB 热门电影榜单",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "popular_tv",
            title: "热门剧集",
            type: "media_list",
            functionName: "getPopularTV",
            description: "TMDB 热门电视剧榜单",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "now_playing",
            title: "正在热映",
            type: "media_list",
            functionName: "getNowPlaying",
            description: "TMDB 正在热映电影",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "on_the_air",
            title: "正在播出",
            type: "media_list",
            functionName: "getOnTheAir",
            description: "TMDB 正在播出的电视剧",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "top_rated_movies",
            title: "高分电影",
            type: "media_list",
            functionName: "getTopRatedMovies",
            description: "TMDB 高分电影榜单",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "top_rated_tv",
            title: "高分剧集",
            type: "media_list",
            functionName: "getTopRatedTV",
            description: "TMDB 高分电视剧榜单",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "upcoming",
            title: "即将上映",
            type: "media_list",
            functionName: "getUpcoming",
            description: "TMDB 即将上映电影",
            cacheDuration: 3600,
            params: [
                { name: "page", label: "页码", type: "page" }
            ]
        },
        {
            id: "trending",
            title: "趋势榜单",
            type: "media_list",
            functionName: "getTrending",
            description: "TMDB 趋势榜单",
            cacheDuration: 1800,
            params: [
                { name: "page", label: "页码", type: "page" },
                {
                    name: "media_type",
                    label: "媒体类型",
                    type: "enum",
                    defaultValue: "movie",
                    enumOptions: [
                        { title: "电影", value: "movie" },
                        { title: "电视剧", value: "tv" },
                        { title: "全部", value: "all" }
                    ]
                },
                {
                    name: "time_window",
                    label: "时间范围",
                    type: "enum",
                    defaultValue: "week",
                    enumOptions: [
                        { title: "本周", value: "week" },
                        { title: "今日", value: "day" }
                    ]
                }
            ]
        },
        {
            id: "search",
            title: "搜索",
            type: "media_list",
            functionName: "searchMedia",
            description: "搜索 TMDB 电影/电视剧",
            cacheDuration: 600,
            params: [
                { name: "page", label: "页码", type: "page" },
                {
                    name: "query",
                    label: "搜索关键词",
                    type: "string",
                    required: true
                },
                {
                    name: "search_type",
                    label: "搜索类型",
                    type: "enum",
                    defaultValue: "multi",
                    enumOptions: [
                        { title: "全部", value: "multi" },
                        { title: "电影", value: "movie" },
                        { title: "电视剧", value: "tv" }
                    ]
                }
            ]
        },
        {
            id: "mp_subscribe",
            title: "MP 订阅",
            type: "media_list",
            functionName: "moviepilotSubscribe",
            description: "通过 TMDB ID 快速订阅到 MoviePilot",
            cacheDuration: 0,
            params: [
                {
                    name: "tmdb_id",
                    label: "TMDB ID",
                    type: "string",
                    required: true,
                    description: "输入 TMDB ID，如: 12345"
                },
                {
                    name: "media_type",
                    label: "媒体类型",
                    type: "enum",
                    defaultValue: "movie",
                    enumOptions: [
                        { title: "电影", value: "movie" },
                        { title: "电视剧", value: "tv" }
                    ]
                }
            ]
        }
    ]
};

// ==================== 工具函数 ====================

function ensureArray(v) {
    return Array.isArray(v) ? v : [];
}

function getImageUrl(path, size) {
    if (!path) return null;
    var baseUrl = "https://image.tmdb.org/t/p/";
    var sizeMap = {
        poster: "w342",
        backdrop: "w780",
        profile: "w185"
    };
    return baseUrl + (sizeMap[size] || "original") + path;
}

function mapTMDBItem(item, mediaType) {
    var type = mediaType || (item.media_type === "tv" ? "tv" : "movie");
    var title = item.title || item.name || "";
    var releaseDate = item.release_date || item.first_air_date || "";
    var year = releaseDate ? releaseDate.substring(0, 4) : null;
    
    return {
        id: String(item.id),
        title: title,
        posterUrl: getImageUrl(item.poster_path, "poster"),
        backdropUrl: getImageUrl(item.backdrop_path, "backdrop"),
        description: item.overview || "",
        rating: item.vote_average || null,
        year: year,
        mediaType: type,
        tmdbId: String(item.id),
        link: "tmdb://" + type + "/" + item.id
    };
}

// ==================== TMDB 数据源函数 ====================

async function getPopularMovies(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/movie/popular", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "movie");
    });
}

async function getPopularTV(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/tv/popular", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "tv");
    });
}

async function getNowPlaying(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/movie/now_playing", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "movie");
    });
}

async function getOnTheAir(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/tv/on_the_air", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "tv");
    });
}

async function getTopRatedMovies(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/movie/top_rated", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "movie");
    });
}

async function getTopRatedTV(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/tv/top_rated", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "tv");
    });
}

async function getUpcoming(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    
    var data = await Widget.tmdb.get("/movie/upcoming", {
        params: {
            language: language,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, "movie");
    });
}

async function getTrending(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    var mediaType = params.media_type || "movie";
    var timeWindow = params.time_window || "week";
    
    // TMDB trending API 只返回第一页
    if (page > 1) {
        return [];
    }
    
    var data = await Widget.tmdb.get("/trending/" + mediaType + "/" + timeWindow, {
        params: {
            language: language
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, item.media_type);
    });
}

async function searchMedia(params) {
    var page = params.page || 1;
    var language = params.language || "zh-CN";
    var query = params.query || "";
    var searchType = params.search_type || "multi";
    
    if (!query) {
        return [];
    }
    
    var endpoint = "/search/" + searchType;
    
    var data = await Widget.tmdb.get(endpoint, {
        params: {
            language: language,
            query: query,
            page: page
        }
    });
    
    return ensureArray(data.results).map(function(item) {
        return mapTMDBItem(item, item.media_type || (searchType === "tv" ? "tv" : "movie"));
    });
}

// ==================== MoviePilot 订阅模块 ====================

async function moviepilotSubscribe(params) {
    var tmdbId = params.tmdb_id || "";
    var mediaType = params.media_type || "movie";
    var mpUrl = params.mp_url || "";
    var mpToken = params.mp_token || "";
    var language = params.language || "zh-CN";
    
    if (!tmdbId) {
        return [];
    }
    
    // 先从 TMDB 获取媒体信息
    var tmdbData = await Widget.tmdb.get("/" + mediaType + "/" + tmdbId, {
        params: {
            language: language
        }
    });
    
    if (!tmdbData || !tmdbData.id) {
        return [];
    }
    
    var title = tmdbData.title || tmdbData.name || "";
    var releaseDate = tmdbData.release_date || tmdbData.first_air_date || "";
    var year = releaseDate ? releaseDate.substring(0, 4) : "";
    
    // 构建返回的媒体项
    var item = {
        id: String(tmdbData.id),
        title: title,
        posterUrl: getImageUrl(tmdbData.poster_path, "poster"),
        backdropUrl: getImageUrl(tmdbData.backdrop_path, "backdrop"),
        description: tmdbData.overview || "",
        rating: tmdbData.vote_average || null,
        year: year,
        mediaType: mediaType,
        tmdbId: String(tmdbData.id),
        link: "tmdb://" + mediaType + "/" + tmdbData.id
    };
    
    // 如果配置了 MoviePilot，显示订阅信息
    if (mpUrl && mpToken) {
        item.description = (item.description || "") + 
            "\n\n【MoviePilot 订阅信息】\n" +
            "名称: " + title + "\n" +
            "类型: " + (mediaType === "tv" ? "电视剧" : "电影") + "\n" +
            "年份: " + year + "\n" +
            "TMDB ID: " + tmdbId + "\n\n" +
            "点击进入详情页可查看订阅按钮";
    }
    
    return [item];
}

// ==================== 详情加载与 MoviePilot 订阅 ====================

async function loadDetail(link) {
    // 解析 tmdb://movie/123 或 tmdb://tv/123 格式
    var match = link.match(/^tmdb:\/\/(movie|tv)\/(\d+)$/);
    if (!match) {
        throw new Error("Invalid link format: " + link);
    }
    
    var mediaType = match[1];
    var tmdbId = match[2];
    
    // 获取详情
    var language = Widget.storage.get("language", "zh-CN");
    var data = await Widget.tmdb.get("/" + mediaType + "/" + tmdbId, {
        params: {
            language: language,
            append_to_response: "external_ids,credits"
        }
    });
    
    var title = data.title || data.name || "";
    var releaseDate = data.release_date || data.first_air_date || "";
    var year = releaseDate ? releaseDate.substring(0, 4) : "";
    var imdbId = data.external_ids ? data.external_ids.imdb_id : null;
    
    // 获取 MoviePilot 配置
    var mpUrl = Widget.storage.get("mp_url", "");
    var mpToken = Widget.storage.get("mp_token", "");
    
    // 构建描述信息，包含 MoviePilot 订阅信息
    var description = data.overview || "";
    
    if (mpUrl && mpToken) {
        // 尝试调用 MoviePilot API 添加订阅
        var subscribeResult = await callMoviePilotSubscribe(mpUrl, mpToken, mediaType, tmdbId, title, year);
        
        description += "\n\n━━━━ MoviePilot 订阅 ━━━━\n";
        description += "名称: " + title + "\n";
        description += "类型: " + (mediaType === "tv" ? "电视剧" : "电影") + "\n";
        description += "年份: " + year + "\n";
        description += "TMDB ID: " + tmdbId + "\n";
        
        if (subscribeResult.success) {
            description += "\n✅ " + subscribeResult.message;
        } else {
            description += "\n❌ " + subscribeResult.message;
            description += "\n\n手动订阅方法:\n";
            description += "1. 打开 MoviePilot\n";
            description += "2. 进入「订阅」页面\n";
            description += "3. 添加订阅，输入 TMDB ID: " + tmdbId;
        }
    } else {
        description += "\n\n━━━━ MoviePilot 订阅 ━━━━\n";
        description += "⚠️ 未配置 MoviePilot\n";
        description += "请在组件设置中配置:\n";
        description += "- MoviePilot 地址\n";
        description += "- MoviePilot Token\n\n";
        description += "订阅信息:\n";
        description += "名称: " + title + "\n";
        description += "类型: " + (mediaType === "tv" ? "电视剧" : "电影") + "\n";
        description += "年份: " + year + "\n";
        description += "TMDB ID: " + tmdbId;
    }
    
    // 返回详情信息
    var result = {
        id: String(data.id),
        title: title,
        posterUrl: getImageUrl(data.poster_path, "poster"),
        backdropUrl: getImageUrl(data.backdrop_path, "backdrop"),
        description: description,
        rating: data.vote_average || null,
        year: year,
        mediaType: mediaType,
        tmdbId: String(data.id),
        imdbId: imdbId,
        // TV 剧集信息
        seasonCount: data.number_of_seasons || null,
        episodeCount: data.number_of_episodes || null,
        status: data.status || null
    };
    
    // 如果是电视剧，获取季信息
    if (mediaType === "tv" && data.seasons) {
        result.seasons = ensureArray(data.seasons).map(function(season) {
            return {
                id: String(season.season_number),
                seasonNumber: season.season_number,
                title: season.name || ("第" + season.season_number + "季"),
                episodeCount: season.episode_count,
                posterUrl: getImageUrl(season.poster_path, "poster")
            };
        });
    }
    
    return result;
}

// ==================== MoviePilot API 调用 ====================

async function callMoviePilotSubscribe(mpUrl, mpToken, mediaType, tmdbId, title, year) {
    var url = mpUrl.replace(/\/$/, "") + "/api/v1/subscribe/";
    
    var body = {
        name: title,
        type: mediaType === "tv" ? "电视剧" : "电影",
        year: year,
        tmdbid: parseInt(tmdbId)
    };
    
    console.log("MoviePilot 订阅请求:", JSON.stringify(body));
    
    try {
        var resp = await Widget.http.post(url, JSON.stringify(body), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": mpToken
            },
            timeout: 15000
        });
        
        console.log("MoviePilot 响应:", resp.status);
        
        if (resp.ok) {
            var respData = resp.data;
            if (typeof respData === "string") {
                try {
                    respData = JSON.parse(respData);
                } catch (e) {
                    // 忽略解析错误
                }
            }
            
            // 检查响应是否成功
            if (respData && (respData.success === true || respData.id)) {
                return { success: true, message: "订阅成功！" };
            } else if (respData && respData.message) {
                return { success: false, message: respData.message };
            } else {
                return { success: true, message: "订阅请求已发送" };
            }
        } else {
            var errorMsg = "HTTP " + resp.status;
            if (resp.status === 401) {
                errorMsg = "认证失败，请检查 Token";
            } else if (resp.status === 404) {
                errorMsg = "MoviePilot 地址不正确";
            }
            return { success: false, message: errorMsg };
        }
    } catch (e) {
        console.error("MoviePilot 订阅异常:", e.message);
        return { success: false, message: "请求失败: " + e.message };
    }
}
