# React Bits Clone（react-bits 整站复刻）

复刻 https://reactbits.dev（**全部 217 组件，已完成**）。

**Batch 1**：Text Animations 33。
**Batch 2**：Micro Interactions 34。
**Batch 3**：Animations 38。
**Batch 4**：Components 48。
**Batch 5**：Backgrounds 64。

每个组件页 = 预览画布 + Customize 控件 + Props 表 + Dependencies + Code 标签页，与官方同构。五批均已部署，公网全站 217 路由扫描 0 报错。

## 来源与许可

- 组件源码 / demo / 代码常量 / 样式：https://github.com/DavidHDev/react-bits（`vendor/` 为只读官方镜像快照）
- 许可：MIT + Commons Clause，Copyright (c) David Haz。可用于应用/网站/产品（含商用）；不得把组件本身作为库/打包物再分发或出售。原文见 `RECON/LICENSE.md`。

## 技术栈

- React 19 + Vite 8 + react-router-dom（HashRouter，服务器无 SPA fallback）+ Chakra UI v3 + @emotion/react
- 动画/3D：gsap 3.15（SplitText/ScrambleText 插件已免费内置）+ @gsap/react、motion、matter-js、ogl、three、@react-three/fiber、@react-three/drei、@use-gesture/react、vgpu（**锁 0.3.1**，官方同版本；0.6.x 有破坏性 API 变更会导致 ShapeWaves 报错）
- 图标 lucide-react + @hugeicons/react & @hugeicons/core-free-icons（官方 demo 直接使用）；react-icons（LogoLoop/BorderGlow/DomeGallery 等 demo）；toast sonner；字体 geist（fonts.css 相对路径引用，构建时打包）

## 架构（机械化移植策略）

- `src/content/**` — 组件源码（官方字节级复制，五个分类目录）
- `src/demo/**` — 官方 demo（近字节级；仅改动见下方"demo 补丁清单"）
- `src/constants/code/**` — 代码常量（`?raw` 引用 `@content/@tailwind/@ts-default/@ts-tailwind`，别名在 `vite.config.js`）
- `src/tailwind|ts-default|ts-tailwind/**` — Code 变体展示用的只读源文件快照
- `src/components/common/**` — 官方 Preview 控件 kit 的移植：TabsLayout（精简版）、Customize（官方原版）、PreviewSelect/Slider/Switch/Input（原版）、PreviewColorPickerCustom/ColorList（hugeicons→lucide）、PropTable（原版）、OpenInStudioButton（官方即 `() => null` 占位，原版）、BackgroundContent + demoModes + PreviewStageContext（官方原版，无 stage 时模式切换按钮内联渲染）
- `src/components/code/` — CodeExample.jsx（精简重写：usage 动态注入 + JS/TW/TS/TS-TW 变体 + CSS + 复制按钮；无 shiki）、Dependencies.jsx（官方原版 + 本地 useInstallation）
- `src/hooks/` — useComponentProps.js（去 nuqs 本地版，同 API）、其余（useScrubGesture/useSmoothScroll/useForceRerender/useComponentPropsContext/useThemedProps）官方原版
- `src/components/setup/color-mode.jsx` — 固定 dark 桩（同 API）
- `src/registry.jsx` — categories → slug → lazy(demo) 注册表（5 分类 217 项）；`src/App.jsx` — 侧边栏 + HashRouter 外壳（路由 `/:categorySlug/:slug`）
- `src/assets/**` — 官方 demo 内相对导入的资源（logos/stickers/holo-card/lanyard 等，构建时打包）
- `public/assets/**` — demo 以 `/assets/...` 字符串引用的运行时资源（demo 图片 / 3d glb / sounds / video / paper-crumple.jpg 等）

**demo 补丁清单**（其余全部字节级原样）：
- `@/` 别名改相对路径：ShuffleDemo；LaserFlowDemo/RippleDistortionDemo/ScrollExpandDemo；AcidSquaresDemo/ColorBendsDemo/GhostFibersDemo/SlicedWavesDemo
- InfiniteSpiralDemo：tailwind 变体 → vanilla content 版（本工程无 tailwind）
- Batch1 3 个 demo hugeicons→lucide（CircularText/ScrollFloat/ScrollReveal；后续批次装了 hugeicons 后不再需要此类改动）

**加新批次流程**：复制官方 `content/demo/constants` 对应目录到 `src/` → registry 注册（slug/name/lazy import）→ build → 探针 → 部署。

## 跑起来

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
```

## 部署

### 当前：GitHub Pages（2026-11-12 起）

- 公网 URL：**https://kingenbomb.github.io/**
- 仓库：https://github.com/kingenbomb/kingenbomb.github.io（user site 仓库，public）
- 方式：`.github/workflows/deploy.yml` — push 到 `main` 即触发 `npm ci` + `npm run build` → `actions/deploy-pages`
- **必须部署在域名根**：`public/assets/**` 的图片/视频/glb 在 demo 里是写死的 `/assets/...` 绝对路径，
  挂子路径（`/reactbits-clone/`）会全部 404 —— 2026-11-12 第一次就踩了这个坑，扫描出一批
  masked-heading / flying-posters / circular-gallery 失败。所以用 `<user>.github.io` 仓库而非 project page。
- 其他配置：`base: './'` + HashRouter（无需 SPA fallback）+ `public/.nojekyll`
- 体积：入库 27.6 MB / 2783 文件；`vendor/`（23 MB 官方镜像）、`dist/`、`RECON/screenshots/` 均不入库

更新部署 = 直接 push：

```powershell
cd D:\mm\reactbits-splittext-clone
git add -A && git commit -m "..." && git push
gh run watch   # 可选，看构建
```

Actions 里两个无害告警：`actions/*@v4` 被强制跑在 Node 24（Node 20 弃用）、`ubuntu-latest` 2026-10-19 起迁 Ubuntu 26。

### 旧：InstaBox 机器 instabox-11（已失效，勿用）

原地址 `https://8080-agqt3cjoogjlubc56sgytoztjq.instabox.tech` 已于 2026-11 返回 404，
`id_ed25519_instabox` 证书也连不上（`Permission denied (publickey)`）。实例疑似被回收/暂停。
历史产物保留：`RECON/sweep-report.instabox.json`、`RECON/deployed-report.json`。

当时的部署方式（存档）：
```powershell
tar -czf dist.tar.gz -C dist .
scp -P 2222 -i C:\Users\zack_\.ssh\id_ed25519_instabox -o CertificateFile=... D:\mm\reactbits-splittext-clone\dist.tar.gz m_agqt3cjoogjlubc56sgytoztjq@api.instabox.sh:/data/home/splittext-web.tar.gz
ssh instabox 'rm -rf /data/home/splittext-web/* && tar -xzf /data/home/splittext-web.tar.gz -C /data/home/splittext-web && sudo systemctl restart splittext-web'
```

## 验证记录（RECON/）

- **最终全站扫描（GitHub Pages 公网，217 个路由）：217/217 通过、0 报错** —
  `RECON/sweep-report.json`（base = `https://kingenbomb.github.io`），逐条日志 `RECON/sweep-ghpages-root.log`
- 部署首轮验证：`RECON/ghpages-root-report.json`（SplitText：拆字 10、悬停 lift −16.1px、0 报错）
- **子路径部署会挂**（2026-11-12 踩过）：`/reactbits-clone/` 下扫描出约 15 个 FAIL，全是带图片/视频/glb 的页面；
  根因是 demo 源码里写死的 `/assets/...` 绝对路径不随 `base` 改写。`RECON/ghpages-report.json`（子路径）
  与 `RECON/ghpages-root-report.json`（根域）对比即证据。
- 历史（InstaBox 时代）：`RECON/sweep-report.instabox.json` 217/217；分批报告 `RECON/sweep-{animations,components,backgrounds}.json` 为 38/38、48/48、64/64
- Batch 1 探针：SplitText 拆字 10、悬停 lift -16px、完成 toast 触发；各批抽查（Fuse Button/Paper Crumple/Silk 等）均 0 报错
- 已修复问题：latticeLoaderCode.js 下载损坏、Geist 字体打包、各批遗漏的 public 资源（paper-crumple.jpg、masked-heading.mp4、/assets/demo/*、/assets/3d/*、click-soft.mp3 等）、vgpu 降级 0.3.1、sweep 脚本浏览器内存泄漏（每 15 页重启+空页重试）
- `RECON/probe.mjs` 用法：`node RECON/probe.mjs --url <url> --out RECON --label <name>`；`RECON/sweep.mjs <baseUrl> [categorySlug]` 全站或按分类扫描；`RECON/fetch-category.ps1 -Category <Name>` 下载+同步新分类
- Windows 跑 sweep 注意：重型 WebGL 页连续跑会 OOM，脚本已内置浏览器重启；首条路由常因 CDN 冷启动慢，
  之后稳定在 3~5 秒/条（重 WebGL 页可达数分钟）

## 待办 / 后续可选优化

- Code 高亮目前为纯文本 pre（无 shiki 着色），如需再加
- 官方 stage 特性未做（背景全屏/尺寸预设、stage 内嵌刷新与模式按钮的悬浮工具栏）；当前 RefreshButton 与 BackgroundContent 模式切换为 demo 内联渲染，功能等效
- 如官方仓库更新：`RECON/fetch-category.ps1` 重新拉取对应分类 → build → sweep 即可

## React Bits Pro 文档站 + 分类浏览页（2026-11-12）

新增六个页面：`/pro/docs/{components,blocks,app-ui,templates,agent-kit}` 与 `/c/:category`（即官方 `https://reactbits.dev/animations` 那类分类入口 —— 官网真实路径是 `/c/<category>`，直接访问 `/animations` 会 404）。

### 数据来源（全公开面，无鉴权）
- `https://reactbits.dev/pro-manifest.json`（466KB 官方公开目录元数据）：components 230 / blocks 22 类 / appUi 38 / templates 15 / agentKit 19 + agentSkill 1。**目录数据一律取自这里**，不从页面文本反推。
- 页面文案与 DOM 结构：`RECON/pro/dom/pro-{components,blocks,appui,templates,agentkit}/{body,main}.html`（Playwright 全量落盘，离线解析）。
- 免费站卡片顺序：`RECON/pro/free-order.json`（滚动采集，与 registry 逐项核对：仅 `evil-eye` 已从官网上线列表移除，本地仍保留该组件）。
- 预览图/视频为官网静态资源，仅用于本复刻演示；组件代码仍受 MIT + Commons Clause 约束（见上文"来源与许可"）。

### 资产（public/assets/）
| 目录 | 数量 | 体积 | 说明 |
|---|---|---|---|
| `pro/components/` | 230 | ~5MB | `previews/components/<slug>-dark.webp`（760×475）。官网是 light/dark 双图，本复刻纯暗色，只取 dark |
| `pro/agent-kit/` | 20 | ~16MB | `library/showcase/<x>.webp`；agent-skill 卡用 og.png |
| `pro/templates/` | 15 webm + 15 webp | ~13MB | 官方 mp4（1.2–5.7MB）用 ffmpeg 转 VP9 960px CRF40，0.6s 抽帧做 poster |
| `video/` | 216 webm + 216 webp | ~51MB | 官方 `/assets/video/<slug去连字符>.webm|.webp`；`shape-grid` 官网本身就没有预览资源 |

### 文件
- `src/pro/ProApp.jsx` — 路由与外壳（顶栏 + 文档侧栏 + 页脚）
- `src/pro/ProNav.jsx` / `ProSidebar.jsx` / `ProFooter.jsx` / `ProLogo.jsx`（760×111 官方字标 SVG，从站点 DOM 原样提取）
- `src/pro/pages/*.jsx` 五个目录页；`src/pro/cards.jsx` 分类卡/模板卡；`src/pro/ui.jsx` 头部/排序/筛选件
- `src/pro/pro.css` — **只引入 tailwindcss 的 theme + utilities，不含 preflight**，避免 reset 污染既有 217 个 demo；`@custom-variant dark` 绑在 `.pro-app` 的 `.dark` 上（官方暗色值：背景 #0a0a0a、卡片 #111、边框 #1f1f1f、radius .8rem）
- `src/pages/CategoryBrowse.jsx` + `src/css/category-browse.css` — 分类浏览页，复用原站外壳；卡片 hover 才请求 webm
- `src/data/free-previews.json`（216 条 slug→预览路径）、`src/pro/data/pro-catalog.json`（268KB 目录 + 侧栏树 + 页脚，打进懒加载的 ProApp chunk）

### 结构还原度
- 组件卡 352×290 @1440（官网 352×289.75）；`grid-cols-1 sm:2 lg:3`、`p-1 / rounded-xl / aspect-[16/10]`、New 角标位置一致
- blocks/app-ui 预览是官网那套纯 div 骨架（直接复用抓到的 `aria-hidden` 子树 HTML），暗色走 `dark:` 变体
- 排序/筛选 chip 与计数（All 230 / New 80 / Text 34 / Backgrounds 98 / 3D & Shaders 49 / Cursor Effects 21 / UI & Cards 28）逐项与官网核对一致
- 侧栏 = 官网真实分组树（Get Started / Site / Browse / 各分类 + 230 个组件项），分组计数与徽标保留

### 踩坑：cascade layer 顺序（dev 正常、build 后 Tailwind 全废）
首次 `npm run build` 后 pro 页的 `padding/margin/gap` 全变 0（导航 73px 塌成 40px、卡片 352→384），dev 下却正常。

根因：`@chakra-ui` 在运行时注入 `@layer reset { *{margin:0;padding:0} }`，Tailwind utilities 在 `@layer utilities`。**层优先级高于特异性**，层顺序由最先出现的那条 `@layer a, b, c;` 决定：dev 时 Vite 把 pro.css 以 `<style>` 插在 Chakra 之后 → utilities 赢；build 后 pro.css 变成先加载的 `<link>` → Chakra 的 reset 层后声明 → reset 压掉所有 utilities。

修复：`src/css/layers.css` 作为 `main.jsx` 的**第一个** CSS import，显式声明
`@layer reset, theme, base, components, utilities;`（reset 最低）。项目手写样式都是无层 CSS，仍压过全部层，所以既有 217 个 demo 不受影响（prod 复核：h1 36px、侧栏 252px、body 背景 `#120f17` 不变、0 报错）。

### 第五轮：部署（2026-11-12 16:45）

推到 `main` = 上线，因为 `.github/workflows/deploy.yml` 是 `on: push: main`（build → upload-pages-artifact → deploy-pages），不用手动跑命令。

- 仓库：`kingenbomb/kingenbomb.github.io`（user site，域名在根，所以 `base:'./'` + 绝对 `/assets/...` 都对）
- 提交：`379c1e2`，2127 个文件，152.7MB（.gitignore 里排掉了 `RECON/pro/tmp/` 74.7MB 的原始视频下载和 `RECON/pro/shots/` 8.2MB 的验证截图）
- 线上：<https://kingenbomb.github.io/> · <https://kingenbomb.github.io/#/pro/docs/components>
- Pages 站点 171.7MB（54MB 是免费站的 432 个 demo 视频，78MB 是 pro 截图），远低于 1GB 上限
- 线上校验（`sweep_live_site.mjs`）：**104 个页面 0 问题 0 console error**；首页 100 卡、目录 230 卡、组件页 canvas 在跑（luma 23）、Code tab 3412 字符、变体页 46 个 DOM 节点、Ctrl+K 搜"光标"出 Cursor 系列、回车落到 `ascii-cursor`
- 坑：`page.goto()` 只改 hash **不会重新加载文档**，所以批量扫线上必须给 URL 加个 `?r=N` 强制重载，否则会误报一片"白页"

### 第四轮：中英文搜索（2026-11-12 傍晚）

全站（`/pro/*` 每一页）一个搜索框，`Ctrl/⌘ K` 或点导航 Search 打开，**中英文同一个输入框**：941 条索引，覆盖 230 组件 + 600 变体 + 60 分类 + 15 模板 + 20 agent-kit + 16 个文档/页面。

**目录是英文的，中文靠翻译层**（`RECON/pro/build_search_zh.py` → `src/pro/data/search-zh.json`，106KB）：
- `t`：条目**标题里那几个英文词**的中文名（`Custom Cursor` → 自定义/光标/鼠标），强信号
- `w`：标题是否**整词可译**（`Pricing` 是、`Pricing 1` 不是），整词译命中给 96 分，部分命中 92
- `k`：所在分组 / 标签 / 渲染模式的英文名（`Cursor Effects` → 光标、鼠标、指针、拖尾、跟随），弱信号 58–68
- 打分：标题全等 100 > 整词译 96 > 前缀 82 > 整词译部分 92/74 > 词首 68 > 关键词 58–68 > 子串 54 > slug 30 > 描述 24
- 多词查询是 **AND**：`pricing table` 要求同一条目同时命中两个词
- 英文查询走原路径（`cursor` → Cursor Wave 前缀优先），中文查询走翻译层，两者排序在同一套分数里

实测：`光标` → Cursor 系列打头；`渐变` → Gradient Bars/Blob/Carousel 打头，AI Blob 等 58 分在后；`定价` → Pricing 分类 + Pricing 页在前，Pricing 变体在后；`模板` → Templates 页在前；`3D` → 3D Letter Swap / 3D Text Reveal 在前。

**交互**：↑↓ 选择、↵ 打开、esc 关闭、↑↓ 时自动滚动可视区；空态给 8 个中英混排建议词；无结果时按语言给不同提示（中文提示"试试英文名"）；中文查询时每条结果下方显示命中的中文关键词 chips（命中的高亮）。

**性能**：索引和 `search.js`（含 catalog/detail/zh）**按需动态 import**，首次打开对话框才加载；目录页自己的过滤框只用 `search-core.js`（仅 106KB 的关键词表），所以首屏不多背 600KB 数据。`Ctrl+K` 在任意 pro 页面可用，导航按钮 ≤640px 只显示图标。

**校验**：`verify_search.mjs`（10 组查询 + 键盘流程 + 目录页中文过滤）、`debug_search.mjs`（直接调 `searchAll` 看分数）、`shots_search.mjs`（三个状态截图）、`verify_catalogue_filter.mjs`（`?q=光标` → 41 张卡、`?q=gradient` → 3 张）。prod 构建后 0 console error。

### 第三轮：付费内容自己实现（2026-11-12 深夜）

第二轮之后详情页仍然是"官方截图 + 解锁面板"，被指出"需要付费的你根据预览情况自己实现"。于是做了 **830 个页面的可运行重实现**：每个组件/变体详情页现在有三个 tab —— **Live（我写的实现，真在跑） / Official capture（官方截图） / Code（对应源码，可复制、可 Copy for AI）**。

**怎么做到"根据预览"**：我看不到图，所以把 830 张预览图全部数值化了（`analyze_previews.py` / `analyze_stills.py`）。
- 每张图取 6 个主色、平均亮度、对比度、亮像素占比、饱和度、帧间运动量 → `preview-facts.json`（230）/ `still-facts.json`（580）
- 主色直接当调色板（暗色太暗会被 `lift()` 提亮到可读），亮度→密度、运动量→速度
- 这样 `draggable-grid` 拿到的是它自己那张图的配色，而不是我拍脑袋的颜色

**组件层**：15 个手写 canvas/CSS 模式（`src/pro/live/patterns/`），每个都是独立文件、真能跑、可直接复制：
`dotField / particleLines / ribbons / rings / perspectiveGrid / glitchBars / splitText / cursorTrail / cardStack / marqueeStrip / gradientBlobs / barChart / wireGlobe / ditherNoise / maskReveal`
230 个组件按"分组优先 + 关键词"映射到模式（`build_live_specs.py`），配色/密度/速度来自各自的官方截图。

**布局层**：18 个手写布局（`src/pro/live/blocks/`）覆盖 60 个分类：
`hero / features / pricing / faq / nav / footer / auth / form / table / chat / dashboard / shell / cards / steps / dialog / stats / profile / notFound`
600 个 blocks/app-ui 变体按分类映射（`build_block_specs.py`），文案直接用变体自己的名称 + 描述（所以 "Two-column hero with social proof" 会真的渲染成两栏 hero 带社会证明）。

**顺手做的校准**：拿官方图的 `luma/bright` 当靶子量我们自己的渲染（`measure_live.mjs` 直接读 canvas 像素），发现普遍偏暗（`draggable-grid` 0.002 vs 0.146），于是给 10 个 canvas 模式加了柔和的 accent wash 背景 + 提高点/线尺寸与 alpha，重测后基本落在官方值 0.5–2 倍区间。这是"看不了图也能对表"的办法。

**明确不是原文**：这些是我的重实现，不是官方源码（官方源码是付费的）。页面上标了 "My own implementation, written from the official capture — the paid source is not reproduced."

> 事故：用 `io.open(p,'w').write(io.open(p).read()...)` 批量替换时，写入先求值导致 15 个模式文件被截断成 0 字节。因为没有 commit，只能按上下文重写全部 15 个文件（重建后 build 通过、尺寸复核）。教训：批量改文件一律用独立脚本 + 先读后写，别在单行里同时 open 两个句柄。

### 第二轮：把所有"跳源站"的按钮改成真页面（2026-11-12 晚）

第一轮把目录页的卡片/侧栏/购买按钮全部外链到 pro.reactbits.dev，被指出"应该自己复刻"。于是补了 **936 个本地页面**，`main` 里 `pro.reactbits.dev` 链接归零。

新增路由（都在 `src/pro/ProApp.jsx`）：

| 路由 | 页面 | 数量 |
|---|---|---|
| `/pro/docs/components/:slug` | 组件详情：官方动图预览（16:9）+ 分类/许可证/代码变体/tags + 解锁面板 + 上下篇 | 230 |
| `/pro/docs/blocks/:cat` | 分类详情：变体网格 + Default/Newest 排序 + Grid/List 切换 | 22 |
| `/pro/docs/blocks/:cat/:variant` | 变体详情：官方 16:9 截图 + 安装名 + 解锁 + 上下篇 | 300 |
| `/pro/docs/app-ui/:cat` + `/:variant` | 同上（App UI） | 38 + 300 |
| `/pro/docs/templates/:slug` | 模板详情：本地 webm 录屏 + Built With + About + Special Features + Included Sections | 15 |
| `/pro/docs/agent-kit/:kind/:slug` | Agent Kit 详情：3 张官方截图 + when-to-use + 公开正文节选 + 19 节目录 + Pairs with | 20 |
| `/pro/docs/{introduction,installation,mcp}` | CLI/MCP/介绍文档（含 8 段代码块 + 复制按钮） | 3 |
| `/pro/docs/saved` | Saved：localStorage 书签（详情页有 Save 按钮），不再是死链 | 1 |
| `/pro/pricing` | 定价页，三档 + 终身/年付 + Polar checkout | 1 |
| `/pro/{about,license,privacy,roadmap,changelog,affiliate}` | 营销页（正文全量落地） | 6 |

**新增资产** 956 个，58MB → `public/assets/pro/showcase/`
- `blocks/` 280（300 个变体里 20 个官方没截图，按 manifest 的说明"null media = 还没截"渲染文字卡）
- `app-ui/` 300、`components/` 300（150 个动图 webp + 150 张 poster；另 80 个组件只有静态 dark 图，回退用它）
- `library-showcase/` 57（agent kit 每项 3 张）、`agent-kit/` 19
- 源站两套基址：`https://reactbits.dev/rbp/<path>`（showcase）与 `.../rbp/library-showcase/<x>.webp`；早期误用 `pro.reactbits.dev/showcase/*` 全 404

**新增数据**：`src/pro/data/pro-detail.json`（372KB，230 组件 + 600 变体 + 15 模板 + 20 AK）、`docs-content.json`、`site-content.json`（从 DOM 抽的正文块：h2/h3/p/list/code/table/stat/step）。

**仍然外链的 5 类**（都带 ↗ 与 title 提示）：
1. `/login` — 没有后端，登录/许可是真的做不了
2. `/builder` — Landing Builder 是个应用，不是页面
3. `/testimonials` `/use-cases` `/compare` `/alternatives` — 卡片网格营销页，通用正文抽取会把布局拆散，硬塞不如不做
4. `/faqs` — 官网自己就是 404（保留原样是保真）
5. Polar 收银台、模板的 Vercel demo、页脚署名的 `https://pro.reactbits.dev`

### 已知偏差（有意为之）
- 详情页的 **Code tab 是我的重实现**（15 个 canvas 模式 / 18 个布局），不是官方源码；官方那份是付费内容。**Customize 调色面板和 Props 表仍然没有**——那两块要靠真组件 + 真实 props 定义，我没有官方 API 面，编一张 Props 表等于造假。`Copy for AI` 做了，复制的是"描述 + 我的源码 + 用法 + config"。
- **分类排序只给 A→Z / Z→A**：官网是 `A to Z / Newest`，但 "Newest" 的真实顺序没有任何公开字段（`pro-manifest.json` 无 dateAdded，免费站 DOM 也只按字母序），编一个假顺序不如不给。
- 顶栏 Library 下拉换成本地五个分区（官网是 mega menu + 搜索面板）；Search 按钮与 ⌘K 跳组件页并聚焦搜索框。
- 登录 / Builder / 四个卡片网格营销页仍外链（原因见上）。

### 验证脚本
`RECON/pro/verify-pages.mjs`（七页冒烟 + 截图到 `RECON/pro/shots/`）、`verify-pro.mjs`（搜索/排序/筛选/分区切换/深链）、`verify-cat.mjs`（分类页网格与 hover 播放）、`verify-layout.mjs`（卡片像素尺寸、侧栏滚动、移动端断点、卡片跳转）。
