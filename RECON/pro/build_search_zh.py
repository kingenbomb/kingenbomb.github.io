"""Build a bilingual keyword layer for the pro catalogue.

The catalogue is English-only, so Chinese queries need a translation table. Each entry gets:
  t: Chinese names of the words that actually appear in its English *title*  (strong signal)
  k: Chinese names of its group, tags and pattern                            (weaker signal)
"""
import io
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = r"D:\mm\reactbits-splittext-clone"
catalog = json.load(io.open(os.path.join(ROOT, "src", "pro", "data", "pro-catalog.json"), encoding="utf-8"))
detail = json.load(io.open(os.path.join(ROOT, "src", "pro", "data", "pro-detail.json"), encoding="utf-8"))
live = json.load(io.open(os.path.join(ROOT, "src", "pro", "data", "live-specs.json"), encoding="utf-8"))
blocks = json.load(io.open(os.path.join(ROOT, "src", "pro", "data", "block-specs.json"), encoding="utf-8"))

GROUPS = {
    "Text": ["文字", "文本", "字体", "标题", "排版"],
    "Backgrounds": ["背景", "底纹", "壁纸"],
    "3D & Shaders": ["3D", "三维", "着色器", "shader", "立体"],
    "Cursor Effects": ["光标", "鼠标", "指针", "拖尾", "跟随"],
    "UI & Cards": ["界面", "卡片", "组件", "ui"],
}

TOKENS = {
    "3d": ["3D", "三维"], "mobile": ["移动端", "手机", "移动"], "responsive": ["响应式", "适配"], "desktop": ["桌面端"], "tablet": ["平板"], "app": ["应用"], "custom": ["自定义"], "animated": ["动画"], "interactive": ["交互"], "simple": ["简约"], "minimal": ["极简"], "modern": ["现代"], "basic": ["基础"], "group": ["组"], "2d": ["2D"], "dot": ["点", "点阵", "圆点"], "particle": ["粒子", "颗粒", "星尘"],
    "particles": ["粒子", "颗粒"], "star": ["星", "星光"], "dust": ["尘埃", "灰尘"], "cloud": ["云"],
    "smoke": ["烟", "烟雾"], "fog": ["雾"], "mist": ["薄雾"],
    "wave": ["波", "波浪", "波动"], "waves": ["波", "波浪"], "waveform": ["波形"], "ripple": ["涟漪", "水波"],
    "ribbon": ["丝带", "飘带"], "filament": ["丝", "光线"], "thread": ["线", "细线"],
    "beam": ["光束", "射线"], "ray": ["光线"], "spotlight": ["聚光", "聚光灯"],
    "grid": ["网格", "栅格"], "lattice": ["晶格", "网格"], "hex": ["六边形"], "hexagon": ["六边形"],
    "voxel": ["体素", "像素块"], "pixel": ["像素"], "pixels": ["像素"], "pixelate": ["像素化"],
    "mosaic": ["马赛克", "拼贴"], "dither": ["抖动", "噪点", "半调"], "noise": ["噪声", "噪点"],
    "ascii": ["字符", "ascii"], "glitch": ["故障", "毛刺", "错位"], "chroma": ["色差", "彩", "色彩"],
    "scanline": ["扫描线"], "scanlines": ["扫描线"], "gradient": ["渐变"], "blob": ["团", "胶体"],
    "glow": ["发光", "辉光"], "glowing": ["发光"], "aura": ["光晕", "氛围"], "aurora": ["极光"],
    "nebula": ["星云"], "light": ["光", "光线"], "neon": ["霓虹"], "chrome": ["镀铬", "金属"],
    "glass": ["玻璃"], "liquid": ["液态", "流体"], "ink": ["墨", "墨水"], "ember": ["余烬", "火星"],
    "flame": ["火焰"], "fire": ["火"], "snow": ["雪"], "rain": ["雨"], "water": ["水", "水面"],
    "droplet": ["水滴"], "sphere": ["球", "球体"], "globe": ["地球", "球体", "世界"],
    "orbit": ["轨道", "环绕"], "ring": ["环", "圆环"], "rings": ["环", "圆环"], "circle": ["圆形", "圆"],
    "vortex": ["漩涡"], "spiral": ["螺旋"], "radial": ["放射", "径向"], "burst": ["爆发"],
    "cursor": ["光标", "鼠标", "指针"], "pointer": ["指针", "光标"], "magnet": ["磁吸", "吸附"],
    "magnetic": ["磁吸"], "trail": ["拖尾", "轨迹"], "follower": ["跟随"],
    "text": ["文字", "文本", "字体"], "type": ["字体", "打字", "排版"], "letter": ["字母", "字符"],
    "letters": ["字母", "字符"], "word": ["单词", "文字"], "words": ["单词", "文字"],
    "glyph": ["字形", "字符"], "headline": ["标题", "大标题"], "title": ["标题"],
    "typography": ["排版", "字体"], "marquee": ["跑马灯", "横向滚动"], "carousel": ["轮播", "走马灯"],
    "slider": ["滑块", "轮播"], "ticker": ["滚动字幕", "行情条"], "reel": ["胶卷", "卷轴"],
    "scroll": ["滚动"], "parallax": ["视差"], "card": ["卡片"], "cards": ["卡片"],
    "deck": ["牌堆", "卡片堆"], "stack": ["堆叠"], "stacked": ["堆叠"], "modal": ["模态框", "弹窗"],
    "dialog": ["对话框", "弹窗"], "popover": ["浮层", "气泡"], "panel": ["面板"],
    "tile": ["瓦片", "方块"], "tiles": ["瓦片"], "bento": ["便当格", "拼块布局"],
    "button": ["按钮"], "toggle": ["开关"], "switch": ["开关"], "tabs": ["标签页"],
    "menu": ["菜单"], "navbar": ["导航栏"], "nav": ["导航"], "navigation": ["导航"],
    "sidebar": ["侧边栏"], "footer": ["页脚", "底部"], "header": ["页头", "头部"],
    "form": ["表单"], "forms": ["表单"], "input": ["输入框"], "field": ["输入框"],
    "select": ["下拉选择"], "table": ["表格"], "list": ["列表"], "kanban": ["看板"],
    "calendar": ["日历", "日程"], "schedule": ["日程", "排期"], "wizard": ["向导", "分步表单"],
    "stepper": ["步骤条"], "steps": ["步骤"], "chat": ["聊天", "对话"], "message": ["消息"],
    "messages": ["消息"], "comment": ["评论"], "comments": ["评论"], "inbox": ["收件箱"],
    "notification": ["通知", "提醒"], "notifications": ["通知"], "toast": ["吐司提示", "轻提示"],
    "dashboard": ["仪表盘", "看板"], "analytics": ["分析", "数据统计"], "chart": ["图表"],
    "charts": ["图表"], "graph": ["图表", "曲线图"], "stats": ["统计"], "metric": ["指标"],
    "metrics": ["指标"], "monitor": ["监控"], "usage": ["用量"], "billing": ["账单", "计费"],
    "pricing": ["定价", "价格"], "plan": ["套餐", "方案"], "plans": ["套餐"],
    "auth": ["登录", "认证", "鉴权"], "login": ["登录"], "signup": ["注册"],
    "sign": ["登录"], "password": ["密码"], "onboarding": ["新手引导", "上手流程"],
    "paywall": ["付费墙"], "empty": ["空状态"], "profile": ["个人主页", "资料"],
    "avatar": ["头像"], "settings": ["设置"], "faq": ["常见问题", "问答"],
    "testimonial": ["评价", "用户反馈"], "testimonials": ["评价"], "review": ["评审", "评价"],
    "hero": ["首屏", "主视觉", "横幅"], "cta": ["行动号召", "转化区"], "feature": ["功能", "特性"],
    "features": ["功能特性"], "banner": ["横幅"], "showcase": ["展示", "作品展示"],
    "gallery": ["画廊", "图库"], "image": ["图片", "图像"], "video": ["视频"], "media": ["媒体"],
    "download": ["下载"], "waitlist": ["候补名单", "预约"], "contact": ["联系", "联系我们"],
    "about": ["关于"], "comparison": ["对比"], "compare": ["对比"], "error": ["错误"],
    "preloader": ["预加载", "加载中"], "loading": ["加载"], "loader": ["加载"],
    "skeleton": ["骨架屏"], "progress": ["进度"], "device": ["设备"], "phone": ["手机"],
    "laptop": ["笔记本"], "browser": ["浏览器"], "credit": ["信用卡", "付款卡"],
    "payment": ["支付"], "checkout": ["结账"], "drag": ["拖拽", "拖动"], "draggable": ["可拖拽"],
    "hover": ["悬停", "悬浮"], "click": ["点击"], "elastic": ["弹性"], "spring": ["弹簧"],
    "smooth": ["平滑", "顺滑"], "kinetic": ["动态", "动能"], "motion": ["动效", "运动"],
    "fade": ["淡入淡出"], "blur": ["模糊"], "morph": ["形变", "变形"], "swap": ["切换", "交换"],
    "reveal": ["揭示", "显现"], "mask": ["遮罩"], "masked": ["遮罩"], "clip": ["裁剪"],
    "flip": ["翻转"], "fold": ["折叠"], "folding": ["折叠"], "tilt": ["倾斜"], "tilted": ["倾斜"],
    "rotate": ["旋转"], "rotating": ["旋转"], "spin": ["自旋"], "tumble": ["翻滚"],
    "reflection": ["倒影", "反射"], "depth": ["景深", "纵深"], "perspective": ["透视"],
    "frame": ["边框", "画框"], "border": ["边框"], "surface": ["表面"], "shader": ["着色器"],
    "webgl": ["三维", "webgl"], "perlin": ["噪声"], "simplex": ["噪声"], "fresnel": ["菲涅尔"],
    "pattern": ["图案"], "stagger": ["错落", "错位"], "split": ["拆分"], "spell": ["拼写"],
    "arc": ["弧"], "curve": ["曲线"], "curves": ["曲线"], "line": ["线"], "lines": ["线"],
    "shape": ["形状"], "shapes": ["形状"], "square": ["方形"], "squares": ["方形"],
    "triangle": ["三角形"], "bar": ["条", "柱"], "bars": ["柱状"], "column": ["列", "柱"],
    "row": ["行"], "matrix": ["矩阵"], "vector": ["矢量"], "svg": ["矢量"],
    "terminal": ["终端"], "code": ["代码"], "keyboard": ["键盘"], "key": ["键"],
    "button-hover": ["按钮悬停"], "gooey": ["黏性"], "squish": ["挤压"], "bounce": ["弹跳"],
    "floating": ["漂浮"], "drifting": ["漂移"], "flow": ["流动"], "flowing": ["流动"],
    "river": ["河流"], "ocean": ["海洋"], "sea": ["海"], "sand": ["沙"], "stone": ["石头"],
    "crystal": ["水晶"], "diamond": ["菱形"], "prism": ["棱镜"], "rainbow": ["彩虹"],
    "spectral": ["光谱"], "spectrum": ["光谱"], "halo": ["光环"], "corona": ["日冕"],
    "sun": ["太阳"], "moon": ["月亮"], "comet": ["彗星"], "meteor": ["流星"],
    "satellite": ["卫星"], "planet": ["行星"], "space": ["太空"], "cosmic": ["宇宙"],
}

PATTERNS = {
    "dotField": ["点阵", "背景"], "particleLines": ["粒子", "连线"], "ribbons": ["丝带", "波浪"],
    "rings": ["圆环", "轨道"], "perspectiveGrid": ["透视网格", "网格"], "glitchBars": ["故障", "条状"],
    "splitText": ["文字拆分", "逐字"], "cursorTrail": ["光标", "拖尾"], "cardStack": ["卡片堆叠"],
    "marqueeStrip": ["跑马灯", "滚动"], "gradientBlobs": ["渐变", "光团"], "barChart": ["柱状图", "图表"],
    "wireGlobe": ["线框地球", "球体"], "ditherNoise": ["抖动", "噪点"], "maskReveal": ["遮罩", "揭示"],
    "hero": ["首屏", "主视觉"], "features": ["功能特性"], "pricing": ["定价"], "faq": ["常见问题"],
    "nav": ["导航"], "footer": ["页脚"], "auth": ["登录"], "form": ["表单"], "table": ["表格"],
    "chat": ["聊天"], "dashboard": ["仪表盘"], "shell": ["应用外壳", "侧边栏"], "cards": ["卡片", "网格"],
    "steps": ["步骤"], "dialog": ["对话框"], "stats": ["统计"], "profile": ["个人主页"],
    "notFound": ["404", "错误页"],
}

PAGES = {
    "introduction": ["介绍", "简介", "开始"],
    "installation": ["安装", "部署", "命令行", "cli"],
    "mcp": ["mcp", "模型上下文协议", "协议"],
    "saved": ["收藏", "书签", "保存"],
    "pricing": ["定价", "价格", "购买", "套餐", "许可证"],
    "about": ["关于", "介绍"],
    "license": ["许可", "授权", "协议"],
    "privacy": ["隐私"],
    "roadmap": ["路线图", "计划"],
    "changelog": ["更新日志", "变更记录"],
    "affiliate": ["联盟", "推广", "返佣"],
    "components": ["组件", "组件库"],
    "blocks": ["区块", "页面区块"],
    "app-ui": ["应用界面", "后台界面", "app ui"],
    "templates": ["模板", "整站模板"],
    "agent-kit": ["智能体", "agent", "技能", "提示词"],
}

# Whole-title translations for the standalone pages (strongest signal of all).
PAGE_TITLES = {
    "pricing": ["定价", "价格"],
    "about": ["关于"],
    "license": ["许可"],
    "privacy": ["隐私"],
    "roadmap": ["路线图"],
    "changelog": ["更新日志"],
    "affiliate": ["联盟"],
    "saved": ["收藏"],
    "introduction": ["介绍"],
    "installation": ["安装"],
    "mcp": ["MCP", "协议"],
    "components": ["组件"],
    "blocks": ["区块"],
    "app-ui": ["应用界面"],
    "templates": ["模板"],
    "agent-kit": ["智能体"],
}

WORD_RE = re.compile(r"[a-z0-9]+")


def title_words(title):
    words = WORD_RE.findall(title.lower())
    out = []
    for word in words:
        if word in TOKENS:
            out.append(word)
        elif word.endswith("s") and word[:-1] in TOKENS:
            out.append(word[:-1])
    return out


def title_zh(title):
    """Chinese names for the words in the English title, first word first."""
    found = []
    for word in title_words(title):
        found.extend(TOKENS[word][:2])
        if len(found) >= 4:
            break
    return found


def whole_title(title):
    """True when every word of the title is a translatable word (Pricing, Custom Cursor)."""
    words = WORD_RE.findall(title.lower())
    if not words:
        return False
    return all(word in TOKENS or (word.endswith('s') and word[:-1] in TOKENS) for word in words)


def match_tokens(haystack):
    found = []
    for token, aliases in TOKENS.items():
        if re.search(r"(?<![a-z0-9])" + re.escape(token) + r"(?![a-z0-9])", haystack):
            found.extend(aliases)
    return found


def uniq(items):
    seen = set()
    out = []
    for item in items:
        if item and item not in seen:
            seen.add(item)
            out.append(item)
    return out


zh = {}

for card in catalog["sections"]["components"]["cards"]:
    spec = live.get(card["slug"], {})
    haystack = f'{card["slug"]} {card["name"]} {card["description"]}'.lower()
    keywords = []
    keywords += GROUPS.get(card.get("group"), [])
    keywords += PATTERNS.get(spec.get("pattern"), [])
    keywords += match_tokens(haystack)
    zh[card["slug"]] = {"t": title_zh(card["name"]), "w": whole_title(card["name"]), "k": uniq(keywords)}

for kind, key in (("blocks", "blocks"), ("appUi", "app-ui")):
    for card in catalog["sections"][key]["cards"]:
        keywords = ["区块" if kind == "blocks" else "应用界面"]
        keywords += match_tokens(f'{card["slug"]} {card["name"]} {card["description"]}'.lower())
        zh[f'{kind}:{card["slug"]}'] = {"t": title_zh(card["name"]), "w": whole_title(card["name"]), "k": uniq(keywords)}
        for variant in next(c for c in detail[kind] if c["slug"] == card["slug"])["variants"]:
            spec = blocks.get(variant["slug"], {})
            haystack = f'{variant["slug"]} {variant["name"]} {variant["description"]}'.lower()
            keywords = [spec.get("categoryName", ""), "区块" if kind == "blocks" else "应用界面"]
            keywords += PATTERNS.get(spec.get("pattern"), [])
            keywords += match_tokens(haystack)
            zh[variant["slug"]] = {"t": title_zh(variant["name"]), "w": whole_title(variant["name"]), "k": uniq(keywords)}

for card in catalog["sections"]["templates"]["cards"]:
    keywords = ["模板", "整站", "落地页"]
    keywords += match_tokens(f'{card["slug"]} {card["name"]} {card["description"]}'.lower())
    zh[f'template:{card["slug"]}'] = {"t": title_zh(card["name"]), "w": whole_title(card["name"]), "k": uniq(keywords)}

for card in catalog["sections"]["agent-kit"]["cards"]:
    keywords = ["智能体", "agent", "技能", "提示词", "配方"]
    keywords += match_tokens(f'{card["slug"]} {card["name"]} {card.get("category") or ""} {card.get("summary") or ""}'.lower())
    zh[f'agent-kit:{card["slug"]}'] = {"t": title_zh(card["name"]), "w": whole_title(card["name"]), "k": uniq(keywords)}

for slug, words in PAGES.items():
    zh[f'page:{slug}'] = {"t": PAGE_TITLES.get(slug, []), "w": True, "k": uniq(words)}

out = os.path.join(ROOT, "src", "pro", "data", "search-zh.json")
json.dump(zh, io.open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

empty = [key for key, value in zh.items() if not value["t"] and not value["k"]]
with_title = sum(1 for value in zh.values() if value["t"])
print("entries:", len(zh), "with title translation:", with_title, "empty:", len(empty))
for slug in ("custom-cursor", "pricing-1", "gradient-bars", "hero-1", "template:agency", "page:pricing"):
    print(f"  {slug:20s}", json.dumps(zh.get(slug), ensure_ascii=False))
print("wrote", out, round(os.path.getsize(out) / 1024), "KB")
