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
