# ReactBits Clone · Component Playground

reactbits.dev 的本地复刻版：五个分类 **217 个组件**，每个组件页 = 预览画布 + Customize 控件 + Props 表 + Dependencies + Code 变体标签页。

| 分类 | 数量 |
| --- | --- |
| Text Animations | 33 |
| Animations | 38 |
| Components | 48 |
| Backgrounds | 64 |
| Micro Interactions | 34 |

## 在线体验

https://kingenbomb.github.io/

> HashRouter，无需 SPA fallback。
> **但必须部署在域名根**：`public/assets/**` 里的图片/视频/glb 在 demo 源码中是写死的绝对路径
> （`/assets/demo/...`），挂在 `/子路径/` 下会全部 404。所以用 `<user>.github.io` 仓库，
> 不要用 project page。

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
```

技术栈：React 19 + Vite 8 + Chakra UI v3 + gsap 3.15（SplitText 插件已内置）+ three / ogl / vgpu。

## 来源与许可

- 组件源码 / demo / 样式：<https://github.com/DavidHDev/react-bits>（`vendor/` 为只读官方镜像快照，不入库）
- 许可：MIT + Commons Clause，Copyright (c) David Haz。
  可用于应用 / 网站 / 产品（含商用）；**不得把组件本身作为库或打包物再分发或出售**。
  原文见 [`RECON/LICENSE.md`](RECON/LICENSE.md)。

## 更多

架构说明、分批移植记录、验证报告见 [`NOTES.md`](NOTES.md) 与 [`RECON/`](RECON/)。
