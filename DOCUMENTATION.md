# USVisaPhotoCom — 官网与 App Store 营销管线说明

面向后续维护者 / Agent：本文描述 **`USVisaPhotoCom/` 目录**内静态站点如何组织、**三种 App Store 营销截图方案**各自做什么、如何运行、输出路径与约束。iOS 工程见同 repo 的 [`USVisaPhoto/DOCUMENTATION.md`](../USVisaPhoto/DOCUMENTATION.md)。

---

## 1. 本目录是什么

- **对外官网**：根目录 `index.html`（Tailwind CDN + Lucide），配套 `privacy.html`、演示图 `demos/`、`AppIcon.png` 等。
- **App Store Connect 用 PNG**：由 **Playwright** 在本地生成；约定使用 **`file://` 打开 HTML**（不依赖 `python -m http.server`）。注意：页面仍可能加载 **Tailwind / Lucide CDN**，首次生成需要网络；与「零本地 HTTP 服务」不是同一概念。
- **与 iOS 应用的关系**：品牌与合规叙事与 App 一致；落地页上的示意截图文件名（如 `demo-app-*.png`）需与仓库内资源一致。App 源码不在本目录。

---

## 2. 目录速览

| 路径 | 职责 |
|------|------|
| `index.html` | 主落地页；可导出区块用 HTML 注释标记（见下文「方案 C」）。 |
| `privacy.html` | 隐私政策页。 |
| `appstore/` | 若存在：与 App Store 相关的静态 HTML 片段或预览（按需维护）。 |
| `demos/`、`demo-app-*.png` 等 | 落地页展示用图片资源。 |
| `marketing/appstore/` | **当前维护的**营销导出工具：`frame.html`、`generate.mjs`、**方案 C** 的 `build-site-shots-html.mjs`、`export-site-shots.mjs`、`targets.json`、`site-shots.json` 等。详见该目录 [`README.md`](marketing/appstore/README.md)。 |
| `tools/appstore-screenshots/` | **早期**「PNG 塞进模板」方案（方案 A），已标注迁移；保留作历史参考。 |
| `dist/` | 生成物默认输出根（见 `.gitignore`，一般不提交）。 |

---

## 3. App Store 营销图：三种方案对照

目标都是：按 **App Store Connect 要求的 iPhone 像素画布**（见 `marketing/appstore/targets.json`）导出 PNG。差异在**内容来源**与**模板形态**。

| 方案 | 位置 | 内容来源 | 渲染方式 | 输出目录（默认） | 状态 |
|------|------|----------|----------|------------------|------|
| **A. 模板 + 预置截图** | `tools/appstore-screenshots/` | `screenshots.json` 指向磁盘上的 PNG；`template.html` 做卡片/文案/可选设备框 | Playwright 打开本地 `template.html`（历史上可用 `file://`；该子目录 README 仍描述此流程） | `dist/appstore/`（脚本 `--out` 可改） | **已迁移说明**：维护重心在 `marketing/appstore`。 |
| **B. Tailwind 画框 + JSON 配置** | `marketing/appstore/` | `screenshots.json`：每帧背景、可选营销文案、**内嵌 data URL 图片**（脚本读文件转 base64，大图曾用 Python+PIL 压 JPEG 以稳定 `file://`） | Playwright `page.goto(file://.../frame.html)` + `addInitScript` 注入 `window.__SHOT__` | `dist/appstore/` | **仍可用**：适合「真机 UI 截图 + 统一画框」多帧编排。入口：`npm run generate`。 |
| **C. 落地页切片（推荐）** | `marketing/appstore/` | **`index.html` 中 `APPSTORE_SHOT` 注释对`** 切出的 HTML 片段；与官网同源 | `build-site-shots-html.mjs` 生成 `generated/shots.html`（含 `<base href="file://.../USVisaPhotoCom/">`）；`export-site-shots.mjs` 按 `targets.json` 截 `#shot-<id>` | `dist/appstore-site/` | **推荐**：改官网即改营销图，少一套 PNG 清单。入口：`npm run site-shots`。 |

**如何选择（给 Agent 的决策树）**

- 营销图要**与 `index.html` 区块像素级一致**、少维护单独素材 → 用 **方案 C**。
- 需要**强定制画框**、多帧用**不同 App 截图路径**拼版、与落地页布局无关 → 用 **方案 B**。
- 只在翻历史或对齐旧脚本 → 看 **方案 A** 的 `tools/appstore-screenshots/README.md`，新工作不要从这里复制一套并行逻辑。

---

## 4. 方案 A（历史）：`tools/appstore-screenshots/`

- **文件**：`template.html`、`generate.mjs`、`screenshots.json`、`targets.json`。
- **流程**：Node + Playwright 按 manifest 把图片和可选文案填入模板，按目标分辨率截图。
- **说明全文**：[tools/appstore-screenshots/README.md](tools/appstore-screenshots/README.md)（内含「已迁移到 marketing」提示）。

---

## 5. 方案 B（现行）：`marketing/appstore` + `generate.mjs`

- **入口**：`cd marketing/appstore && npm install && npx playwright install chromium`
- **生成**：`npm run generate -- --config screenshots.json --targets targets.json --out ../../dist/appstore`
- **核心行为**（阅读源码时抓这些点）：
  - `frame.html`：与站点类似的 Tailwind 配置；接收注入的 `window.__SHOT__`。
  - `generate.mjs`：合并默认与每帧配置；图片转 **data URL** 内联（避免 `file://` 下部分路径/体积问题）；必要时调用本机 **Python + Pillow** 将过大 PNG 转为 JPEG data URL（见脚本内嵌 Python）。
- **配置**：`screenshots.json`（每帧 id、资源路径、可选 copy、deviceFrame 等）、`targets.json`（宽×高、`name` 作为输出子目录名）。

---

## 6. 方案 C（推荐）：落地页切片 → `site-shots`

### 6.1 标记约定（`index.html`）

在要导出的连续 HTML 外侧加成对注释（`id` 与 `site-shots.json` 一致）：

```html
<!-- APPSTORE_SHOT:BEGIN:hero -->
<section>...</section>
<!-- APPSTORE_SHOT:END:hero -->
```

- **不要**嵌套两对 BEGIN/END。
- 改动了区块边界时，同时检查 `marketing/appstore/site-shots.json` 里的 `shots[].id` 列表。

### 6.2 生成流水线

1. **`build-site-shots-html.mjs`**  
   - 读取 `site-shots.json` 中的 `indexHtml`（默认相对路径指向仓库内 `index.html`）。  
   - 按标记抽取片段，写入 **`marketing/appstore/generated/shots.html`**（路径已写入根 `.gitignore`）。  
   - 注入 `<base href="file://…/USVisaPhotoCom/">`，使 `src="AppIcon.png"`、`demos/...` 等在 `file://` 下仍可解析。

2. **`export-site-shots.mjs`**  
   - `file://` 打开 `generated/shots.html`。  
   - 对每个 `targets.json` 条目设置视口，注入 CSS 变量 `--shot-w` / `--shot-h`，**每次只显示一个** `.shot-root`（避免纵向堆叠导致截到错误区域）。  
   - 对每个 `shot id` 输出 `<out>/<target_name>/<id>.png`。

**一键**：`cd marketing/appstore && npm run site-shots`

**可调 CLI**：`export-site-shots.mjs` 支持 `--shots`、`--targets`、`--config`、`--out`、`--settle-ms`（动画/字体/CDN 加载等待）。

### 6.3 与方案 B 的输出隔离

- 方案 B 默认：`dist/appstore/`  
- 方案 C 默认：`dist/appstore-site/`  

避免互相覆盖；上传 App Store Connect 前按 Connect 当前要求核对 `targets.json` 中的尺寸说明。

---

## 7. `file://` 与资源路径（共性说明）

- **推荐**：营销专用 HTML 与 Playwright 均使用 **`pathToFileURL` 生成的 `file://` URL**。
- **相对资源**：方案 C 用 `<base href="...USVisaPhotoCom/">` 统一解析；方案 B 用 data URL 减少路径问题。
- **外链脚本**：Tailwind / Lucide 自 CDN 拉取；完全离线导出需另做 vendor（当前未做）。

---

## 8. 给下一个 Agent 的接手清单

1. 确认任务要的是 **B（画框+截图）** 还是 **C（官网切片）**；不要新建第四套目录级生成器。  
2. 读 `marketing/appstore/README.md` 与本文 **第 3 节对照表**。  
3. 若改 **方案 C**：同步改 `index.html` 标记 + `site-shots.json`，跑 `npm run site-shots`，用 `sips -g pixelWidth -g pixelHeight` 或同类工具抽查 PNG 尺寸。  
4. 若 App Store Connect 尺寸政策变更：只改 `targets.json` 并重跑导出。  
5. iOS 行为、IAP、构图算法：**不要在本目录猜**；读 [`USVisaPhoto/DOCUMENTATION.md`](../USVisaPhoto/DOCUMENTATION.md)。

---

## 9. App Store Campaign v12（单文件 slides：`marketing/appstore-v12/`）

这是另一套「5 张 App Store 截图」的 **单文件 HTML** 方案，用于快速迭代文案与像素级布局（与上面的 A/B/C 不冲突）。核心特性是：

- **入口文件**：`marketing/appstore-v12/campaign.html`
- **五联预览**：`marketing/appstore-v12/preview.html`
- **导出脚本**：`marketing/appstore-v12/export.mjs`（Playwright）

### 9.1 预览方式

- **看单张**：`campaign.html?slide=1`（2–5 同理）
- **可滚动看全图**：`campaign.html?slide=1&scroll=1`
- `preview.html` 会对 iframe URL 自动加时间戳参数，避免浏览器缓存旧版 `campaign.html`。

### 9.2 重要约束（避免误改）

- **Slides 2–5 的 hero 截图槽是锁定几何**：宽高/底对齐由 `:root` 里 `--campaign-hero-*` 控制，图片使用 `object-fit: cover` 填满槽位；不要随意改这些变量。
- **Slide 1 底部 2×2 结果网格是锁定几何**：由 `--s1-edge / --s1-grid-gap / --s1-tile` 控制。
- Slides 2–5 顶部文案使用 `data-copy-slot` + `data-copy-fit` 的自动缩放，不要把文案塞进 hero 槽里。

### 9.3 当前内容映射（按 `?slide=` 编号）

- **Slide 1**：主视觉 + 文案 + pills + 2×2 结果网格（无原图浮层）
- **Slide 2**：省钱对比（Best Value / CVS / Walgreens），右侧副标题槽位
- **Slide 3**：We check（checklist 卡片，卡片宽度与截图槽一致）
- **Slide 4**：Three steps + privacy 三卡（副标题为流程胶囊 `Pick → Auto process → Export`）
- **Slide 5**：7 languages supported（pills + 放大 emoji）

### 9.4 资源路径

- Slide 1 结果图：`demos/demo-0*-result.png`
- Slide 1 原图（如需）：`demos/demo-0*-original.png`（当前未在 Slide 1 渲染）
- Slides 2–5 hero：`demos/hero/IMG_3379.PNG` 等

### 9.5 导出

在 `USVisaPhotoCom/marketing/appstore-v12/` 目录：

- `npm install`
- `npm run export`

输出通常在 `USVisaPhotoCom/dist/appstore-v12/`（以脚本为准）。

---

*文档路径：`USVisaPhotoCom/DOCUMENTATION.md`（仅描述本目录及与其直接相关的生成脚本）。*
