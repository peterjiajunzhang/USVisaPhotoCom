# USVisaPhotoCom — 官网与 App Store 营销管线说明

## 2026-11-05 Android 上线后的双平台官网

本节为当前网站状态；下方 11-04 及更早记录保留其历史时间范围。基于远端 `main` 的 `949f048` 新建独立 worktree 和 `codex/us-dual-platform-20261105`，未合并旧 Android 预览分支，未触碰原 checkout 的未提交文件。本轮仅更新 US 网站，不修改应用、商店 listing、购买配置或其他国家网站。

- **发布依据与公开核验分别记录**：应用仓库 11-05 回执确认 US Android 1.0.0 (6) Production Published。随后实际打开美国区公开 Google Play 页面，看到 **US Visa Photo / Loop Apps**；未登录 Chrome 无痕窗口显示普通 **Install**，无需封测邀请。核验时间为 2026-11-05 21:24 Pacific（11-06 05:24 UTC）。这不是全球所有地区传播或实际安装的证明。详见 `review/us-dual-platform-2026-11-05/store-verification.json`。
- 首页提供官方 App Store、Google Play 徽章和手动平台导航；保留 iPhone 首页及指南原有 ASC campaign URL，购买与导出额度按平台独立。`/android/` 为可索引的英文正式页，展示实际 Android 流程、免费处理/预览及单次付费 JPEG 导出。美国区 Google Play About 对话框显示 `$1.99 per item`，美国区 App Store 当前描述写 `$1.99 per photo`；页面同时说明以当地商店购买前显示的价格为准。未实际安装或购买。
- Android 图像仅来自本次发布暂存目录 `android/build/play-release-submission-2026-11-05/upload-staging/us/en-US/phoneScreenshots/` 的 01、02、03、06；整图等比缩小转 WebP，共 288,884 字节，不裁剪、重绘、移除水印或改变购买状态。来源与输出 SHA-256、尺寸及官方徽章来源见 `android/assets/provenance.json`。七语素材仍以应用发布目录为准；本轮官网先交付英文。
- 文案按平台区分本地模型与 Apple 框架，明确 Android Google SDK 诊断和购买数据披露；保留背景替换／无纯裁剪导出限制、独立开发者身份及不保证官方接受的说明。未宣传打印排版或补光修正。
- `privacy.html`、`privacy-android.html`、`support.html`、`acquisition-campaigns.json` 与 `949f048` **字节一致**；Android 政策另与应用仓库最新 `android/play/privacy-android.html` 校验一致。没有用旧预览政策覆盖线上政策。原指南 URL 全部保留，sitemap 扩为 9 项。
- 首页 Tailwind 改为编译后静态 `assets/home.css`，不再运行 Tailwind CDN；更新 utility class 后执行 `bash scripts/build_home_css.sh`（固定 Tailwind 3.4.17）。`assets/platforms.css` 为双平台公共样式，Android 页不需要构建。既有 Lucide、Cloudflare 网站统计沿用；没有新增下载点击采集器，也不把访问量当安装量。下文旧 Tailwind CDN／营销导出说明仅适用于其历史工具和未改动页面。
- 验收：6 个主要页面 × 320/390/768/1440 px 共 24 组浏览器检查，无横向溢出或已加载缺图；实际点击两商店入口、平台导航、11 项 FAQ、支持与两份隐私政策链接。静态检查覆盖 9 个 HTML、268 个站内引用与锚点、结构化数据、9 条 sitemap URL 和素材哈希。证据与桌面／手机截图在 `review/us-dual-platform-2026-11-05/`。
- **验收范围**：Chrome 视口模拟，未另测真实 Safari/Android 浏览器；没有执行真实安装、支付或跨地区价格核验。改动页未观察到运行错误；未改动 iPhone 隐私页仍有既有 Tailwind CDN 生产环境警告，政策正文保持不变。
- **部署**：沿用 GitHub Pages `main` 根目录；实现提交后核对 Pages 构建及线上资源，回执补入同一 review 目录。

## 2026-11-04 搜索获客试点

> **18:49 Pacific 访问诊断纠正**：先前“浏览器访问禁用”仅由标签页接口报错推断，不能扩大为全部 Chrome 不可用。用户指出后，实测文档支持的原生 Chrome 入口可用，ASC/GSC 已登录，US sitemap 已成功重提。无需因此要求用户修改 Work 设置。下方未完成项为各时点记录，最新回执与后台进度以 sibling `VisaPhotoApps/docs/marketing/search-acquisition.md` 为准。

**Bing 手动验证**：首页加入 Bing Webmaster 实际提供的 `msvalidate.01` 公共所有权标签；不导入 Google property、不授权额外 GSC 数据范围。部署后已回 Bing 验证，实际收到 Site addition successful；sitemap 已提交、Processing。首页索引检查显示 Indexed successfully（旧抓取 9-13），三指南已发现但未抓取；四页各请求一次更新/索引，回执成功。

**同日后续归因配置**：已在已登录 ASC 的 US App → Analytics → Campaigns 页面实际生成首页和指南两条 campaign links，原值记在 `acquisition-campaigns.json`；据 `VisaFlavor.supportLinks` 再次核对 App ID 后接到首页三处下载按钮及隐私/收费指南的下载按钮。JSON-LD 的实体下载 URL 保留干净链接。没有加入点击事件收集器；Cloudflare 记录 page views，Apple campaign 衡量可报告的下载归因。Campaign UI 当前数据不足，并明确至少 5 个独立 Apple Accounts 安装才可展示，不能据链接上线就报告归因安装数。

本仓库是 `https://us.visaphoto1tap.com/` 的 GitHub Pages 源站（`main` 根目录）。本轮仅修改网站；不改变 US iOS 1.1.5、App Store listing 或已批准截图。产品功能及发布状态以 sibling `VisaPhotoApps/DOCUMENTATION.md` 顶部和 `docs/appstore/version-update-workflow.md` §2 为准；下文旧 `USVisaPhoto/` 路径和旧营销导出方案为历史，不能作为当前发布流程。

- 新增 `guides/index.html` 和三篇英文指南：规格、DS-160 上传失败排查、隐私与收费。它们是直接维护的静态 HTML，没有额外构建依赖；共享样式为 `assets/guides.css`。
- 三篇均标作者、核验日期和官方来源；当前 App **替换背景、没有纯裁剪导出**，文件清单不等于政府认可；不宣传打印排版、补光修正或自动扶正等未上线能力。
- **原文矛盾及本轮澄清**：基线提交 `50a5c2e` 的首页曾写 “meets U.S. State Department requirements”“DS-160 compliant”“Works for all U.S. photo IDs”，与当前政府用照片编辑边界及已核实支持范围不一致。用户已于 11-04 授权执行此前建议的“收窄承诺”方案；本轮在原文位置改为实际处理能力并添加编辑限制，保留本记录和基线提交以供核验。未核验的 CVS/Walgreens 价格、节省金额及服务比较同时移除。验证方法：`git show 50a5c2e:index.html` 对比当前页面，结合 App 功能状态表与页面所链 Department of State 原文。
- 首页、指南、隐私页建立站内入口，sitemap 由 2 项扩为 6 项。`robots.txt` 继续通配允许抓取，排除历史 `archive/` 与内部脚本 `scripts/`；没有修改既有训练偏好。允许抓取不代表已经收录或被 AI 推荐。
- **统计现状**：首页原已有 Cloudflare Web Analytics，本轮沿用同一公开 site token 到指南，不加 GA4。隐私页另加网站统计澄清，避免把 App“无 analytics SDK”与网站访问统计混为一谈。Cloudflare Web Analytics 当前不支持自定义点击事件，不能把页面访问当下载点击；ASC campaign links 同日后续已实际生成并接入四处下载按钮，来源与回读回执见上方及主仓库台账。
- `indexnow.json` 和根目录同名 key 文本是公开域名验证材料。`python3 scripts/notify_indexnow.py` 默认只预览；部署后用 `--submit --receipt dist/seo-2026-11-04/indexnow.json` 验证线上 key 并通知。200/202 仅代表接收通知，不是收录证明。
- 本地验证：6 个页面 canonical/description/H1、125 个站内链接和资源、6 条 sitemap URL、指南 JSON-LD、Cloudflare 标签及 App Store 目标一致；`git diff --check`、Python 编译通过。Apple 公共 lookup（US storefront）回读 US Visa Photo 1.1.5、iOS 17.0、免费下载。**纠正原访问诊断后**，Chrome 桌面已查看目录与三篇指南，实际点击指南 campaign 链接到达正确 US App Store 页面；GSC/Bing/ASC 当前后台已验收。手机布局尚未独立验收。
- Google/Bing 所有权、sitemap 提交及 URL 状态已实际回读，Google Search generative AI 为 Include；ASC 两条链接已上线。Cloudflare 的 US snippet 与网站一致，目录和三篇指南各一次验收访问实际入库，共 4 次 direct page views；不计作自然流量，不当下载点击。Apple campaign 当前低于展示门槛，尚无可报告归因结果。所有回执与当前进展在 sibling `VisaPhotoApps/docs/marketing/search-acquisition.md`。

---

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

## 9. App Store Campaign v12（单文件 slides：`VisaPhotoApps/Marketing/US/appstore/`）

这是另一套「5 张 App Store 截图」的 **单文件 HTML** 方案，用于快速迭代文案与像素级布局（与上面的 A/B/C 不冲突）。核心特性是：

- **入口文件**：`VisaPhotoApps/Marketing/US/appstore/campaign.html`
- **五联预览**：`VisaPhotoApps/Marketing/US/appstore/preview.html`
- **导出脚本**：`VisaPhotoApps/Marketing/US/appstore/export.mjs`（Playwright）

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

在 `USVisaPhotoCom/VisaPhotoApps/Marketing/US/appstore/` 目录：

- `npm install`
- `npm run export`

输出通常在 `VisaPhotoApps/Marketing/US/appstore/dist/`（以脚本为准）。

---

*文档路径：`USVisaPhotoCom/DOCUMENTATION.md`（仅描述本目录及与其直接相关的生成脚本）。*
