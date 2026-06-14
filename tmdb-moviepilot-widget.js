/**
 * TMDB + MoviePilot Widget
 * 查询 TMDB 热门电影/电视剧，并支持 MoviePilot 订阅联动
 * 
 * 功能：
 * 1. TMDB 热门电影/电视剧榜单
 * 2. TMDB 搜索功能
 * 3. MoviePilot 订阅联动（在详情页描述中显示订阅信息）
 */

var WidgetMetadata = {
    id: "tmdb-moviepilot",
    title: "TMDB + MoviePilot",
    description: "查询 TMDB 热门电影电视剧，联动 MoviePilot 订阅",
    version: "1.4.0",
    author: "anlan-home",
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
    
    // 构建基础描述
    var description = data.overview || "";
    
    // 添加 MoviePilot 订阅信息到描述
    if (mpUrl && mpToken) {
        var subscribeInfo = "\n\n━━━ MoviePilot 订阅 ━━━\n";
        subscribeInfo += "标题：「" + title + "」\n";
        subscribeInfo += "类型：" + (mediaType === "tv" ? "电视剧" : "电影") + "\n";
        if (year) {
            subscribeInfo += "年份：" + year + "\n";
        }
        subscribeInfo += "TMDB ID：" + tmdbId + "\n";
        if (imdbId) {
            subscribeInfo += "IMDB ID：" + imdbId + "\n";
        }
        subscribeInfo += "\n→ 复制以上信息到 MoviePilot 进行订阅";
        
        description = description + subscribeInfo;
    } else {
        description = description + "\n\n━━━ MoviePilot ━━━\n请在组件设置中配置 MoviePilot 地址和 Token 以启用订阅功能";
    }
    
    // 构建返回信息
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
        seasonCount: data.number_of_seasons || null,
        episodeCount: data.number_of_episodes || null,
        status: data.status || null
    };
    
    // 如果是电视剧，添加季信息
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
