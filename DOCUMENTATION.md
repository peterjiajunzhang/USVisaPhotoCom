# USVisaPhotoCom — 官网与 App Store 营销管线说明

## 2026-11-12 用户纠正：以产品展示和下载为主

用户明确官网用于吸引下载，合规、背景编辑与接受范围放在已链接的要求及隐私／收费说明页，不在宣传页面反复强调。已撤下新增的七语 JPEG 浏览器检查器、所有入口和运行／测试文件；这不是已发布 App 的功能变更。主站与 US 首页去除重复警告、限制卡片及保证接受式 FAQ，US 上传排查文章去掉“不要假定换白底”“别用修图掩盖”等措辞，改为照片质量和实际测量信息。主站和 US 站保留清楚的隐私／收费入口；政策原文、完整要求／收费指南、支持和 campaign 文件保持字节一致。保留真实产品能力、价格与购买平台区分，不新增保证合格或竞品优越性承诺。此前检查器发布记录为已撤回历史，不作为后续周检继续推广的内容实验。

此前已验证的 Google 图标／样式加载修复、延迟示例图与本地小图标继续保留。七语正文独立、原生 App 画面和官方商店徽章不变。验收及发布回执见 `review/copy-correction-2026-11-12/`。

## 2026-11-12 收录诊断与本地文件检查

**最终回读**：内容提交 `7d08e37` 的 Pages 已 built，34 个正式文件 200 且逐字节一致。Google 17:51 实时测试再次为 HTTP 200／可索引，资源 **1/22 失败**，仅 Cloudflare beacon；手机首屏、两家官方徽章及图片恢复正常，控制台无消息。首页与实际新增本地工具的英文排查指南各一次请求均得到 Indexing requested／优先队列回执；首页索引快照仍为 11-11 抓取后未索引，排查指南仍为 11-04 抓取后未索引，没有把实时测试或申请当成正式收录。Google 两张地图仍 Success／7 和 38、最后读取 11-11，未重复重提地图。IndexNow 接收的是本轮第一阶段 21 个变化页（HTTP 200）；后续首页加固未重复刷同一批通知。最终脱敏回执见同日 review 的 `search-notifications.json`，后续仍观察抓取／索引／查询曝光。

**同日后续：资源加载加固。** 首次发布后 17:39 的 Google 实时测试仍 200／可索引，但 20/30 资源 Other error，含 CSS 和图片，手机截图未正确排版；不能称全面渲染修复。相同资源的 12 次公开 HTTP 探测（普通与 Googlebot UA）均 200，UA 探测不等于 Google 来源请求。Google Crawl stats 截至 11-10 显示 US 曾有服务器连接问题、近期失败率可接受，robots 和 DNS 失败率可接受，没有据此改 DNS 或主机配置。

已按这一实际缺口继续加固七语首页：将约 20 kB 首页／平台／徽章／语言 CSS 随 HTML 提供，展开平台 CSS 中的徽章 import，保留原 CSS 级联，首屏不再依赖额外样式请求；12 张示例图共 16,046,132 源文件字节改为 lazy／async，并补实际固有尺寸，图片内容不变。六国菜单图标使用原公开图标的小尺寸本地 WebP（共 35,614 字节，来源和哈希在 `assets/icons/provenance.json`），避免隐藏菜单跨五个主机取大图；截图素材和官方商店徽章仍未改。只是源文件预算和加载策略变化，没有实测 CWV／Lighthouse 分数，也不能把 16 MB 直接称为实测首屏节省。最终静态检查 35 页／1813 引用；七语样式内容、顺序、无 import、延迟图和构建重复性另验。后续部署与 Google 回读以下方 review 回执为准。

Google URL Inspection 仍为 crawled/unindexed，最后抓取 11-11 20:20:14；11-12 17:15 的实时测试可索引、HTTP 200、手机首屏正常，未见 JS 控制台消息。资源面板实际报告 `unpkg.com/lucide@latest` 重定向错误及 Cloudflare beacon 加载错误。人工处置、安全报告均无问题；全域索引汇总截至 11-08，不能取代更新的单 URL 结果。07-27 邮件是 Page with redirect，目前汇总该项为 0，并非当前 US 首页未索引原因。没有证据将资源错误断定为全部不收录的根因。

- 首页八种 Lucide 图形改为官方 0.468.0 内联 SVG，保留许可证；七语页面移除图标 CDN 和 `createIcons` 运行依赖，官方商店徽章及原生图片保持原值。
- 在既有 DS-160 排查指南加入七语浏览器 JPEG 检查器；只读本地选择的文件，检查可读 JPEG、正方形 600–1200px、保守 240,000 字节上限。无上传、编辑、持久化、文件事件统计或新网络 API；超过 10 MiB／3200 万像素时停止解码。明确不评估人物、背景、修图、色彩或压缩比，不保证官方接受，也不改变 App 功能。
- 首页、指南目录增加对应工具锚点。保留原指南 URL、自身 canonical、七语互链和两条既有 ASC campaign；政策与支持文件字节未变。构建器新增逐主题 `pageModified`，仅首页／指南目录／排查指南共 21 个真实变化页面更新 sitemap 日期，其他 17 项沿用原日期，不用构建时间伪造更新。
- 官方文件规格、照片要求和 DS-160 FAQ 于本日回读。静态 35 页及 1794 个引用初验无错误；浏览器实际读取 600px JPEG、拒绝伪装 PNG，并验证 240000／240001 字节边界。320／390／768／1440px 做原生 Chrome 视觉验收；精确滚动宽度未测量，未绕过 DevTools 粘贴保护。预览仅有既有 Cloudflare RUM 的 localhost CORS 错误，无文件检查器异常。12 项状态／边界测试的 Image.decode 为 stub，不能替代浏览器解码验证。
- 本轮证据和截图在 `review/indexing-2026-11-12/`；发布、线上回读和仅变化 URL 的通知回执在完成后追加。收录、关键词曝光、AI 引用和下载提升均待后续实际数据，修复发布不等于获客成功。


## 2026-11-11 中英文整页切换与事实文案

用户在实际同类网站调研后批准英文／简体中文先行。首页、指南目录与三篇指南形成五组对应页面；英文旧 URL 保留，中文使用 `/zh-hans/` 前缀，页头语言切换保持同一主题。目录每个主题只出现一次，不再混列英文和中文文章卡片。旧 `/guides/ds-160-photo-upload-failed-zh.html` 通过 canonical、即时跳转和可点击后备链接兼容，脚本跳转保留查询与片段；无服务器 301 能力，不冒称 301。

- 英文 HTML 为编辑源，`localization/zh-Hans.json` 为已审校译文；详细中文排查文保留在 `localization/zh-upload.html` 作为内容源。修改后在独立虚拟环境安装 `scripts/requirements-locales.txt` 并运行 `scripts/build_locales.py`，提交生成的静态文件。缺译先报错、不写半成品；重复运行输出一致。GitHub Pages main 架构不变，无运行时翻译或强制语言跳转。
- 中英文 title／description／OG、页面语言、结构化文字及文章 inLanguage、自身 canonical、双向 hreflang 和 sitemap 同步；现有英文主页及指南地址保留。sitemap 从 9 项改为 13 项（新增五个中文版本、移除被兼容跳转取代的旧中文地址）。`/localization/` 与 `/scripts/` 不作为公开抓取入口。
- 图片标签与营销标题按 `COPY_GUIDE.md` 改为事实、动作与结果导向。首页只展示原有真实 iPhone 界面，中文页注明英文 UI；原生水印／购买状态、官方商店徽章保持不变。三篇文章均提供同一组 App Store／Google Play 官方下载徽章，复用已有 guides campaign，不新增 token。
- iPhone／Android 购买独立、免费预览／单张付费导出、背景替换／无纯裁剪、光照仅检测、不保证官方接受的边界保留。Android SDK 诊断与购买披露保留。`support.html`、两份政策、`acquisition-campaigns.json` 与发布基线逐字节一致，Android 政策与应用仓库 canonical 也一致。中文支持链接使用已有 `#zh-Hans`，英文政策明确标注“英文”。
- 本地已有 12 页 × 四宽度 48 组基础检查；定稿另复验中文首页与新增指南徽章的 20 组布局。483 个跨主站／US 站内部引用和片段、六组 canonical／语言对应、结构化数据、重复生成与保护文件通过。未观察到横向溢出、已加载缺图或控制台错误。证据、截图及发布回执放 `review/multilingual-2026-11-11/`。未实际安装或付款，未做真实手机 Safari 验收，不能把 QA 页面访问计入自然获客。


### 发布后回执 — 2026-11-11

实现 e244376 在 2026-11-12 01:54:36 UTC Pages built。四个变化 HTML 和 sitemap 均 200、与源逐字节一致；新中文页 390/1440px 线上复验通过，主站中文入口实点可达，控制台无错误。Google 接收九页 sitemap，新中文页已 discovered 并获一次 Indexing requested 回执；Bing 九页地图更新后 Processing／仍旧 8 页。IndexNow 只通知本次四个变化 URL，HTTP 200。接收与队列回执不是收录证明，完整 JSON 及线上截图见同日 review。

## 2026-11-11 AI 搜索复测后的内容优化

- 同六个无品牌问题在三平台实际临时／无痕会话各提交一次，共 18 份完成回答。17 份完整来源样本未出现本产品提及、官网引用或明确推荐；1 份 ChatGPT 来源展开不完整，单列，不算完整负样本。模型条件变化、来源与后台证据在应用仓库本日搜索复测回执中记录。
- Google 主域名已索引（最后抓取 11-11 16:56:58）；US 首页和三篇旧指南仍 crawled/unindexed。Bing US 首页已索引但最后抓取停在 09-13，三篇指南仍 discovered/not crawled；要求指南的实时测试可索引且无 SEO/GEO 问题。旧索引的图片 alt 提示不能直接当作新版阻塞原因。
- 中文问题的 Gemini 来源实际引用中文 DS-160 排查页，而现有指南仅英文。因此新增 `/guides/ds-160-photo-upload-failed-zh.html`，写清三类故障、官方来源、照片处理边界，英中 reciprocal hreflang 和自身 canonical；原英文 URL 保留。不是政府翻译或官方认可。
- 隐私收费页原本已有本地处理披露；本轮新增平台对照表和用户可执行的本地预览自测步骤，区分离线处理、购买验证、SDK 诊断和系统相册云同步。不声称做过独立网络审计，不改政策、既有价格或 campaign 链接。
- 指南索引、新页结构化 Article 和九页 sitemap 同步。正式页仍为静态 HTML，无新增运行依赖。主站补充中文指南发现入口。
- `review/search-retest-2026-11-11/` 记录四页静态／本地链接／canonical/schema 验证、320/390/768/1440px 浏览器验收和截图。实际点击新页两家官方徽章到公开 US listing；未安装或付款。发布后回读及通知回执随后追加，排名和 AI 引用效果尚未观察。


2026-11-11：用户授权全站与 SEO 审查后，页脚新增正式主站的 All country apps 入口，连接国家站与重做后的主域名目录。下载、campaign、政策和应用能力文案沿用当前页面。

## 2026-11-06 统一首页与官方商店徽章（当前）

用户定案：参照 LoopSplit 的单一产品首页，用 iPhone 界面统一展示，Android 只提供正式商店下载入口。当前首页不再区分 iPhone／Android 产品页或展示 Android 界面；两平台隐私政策继续独立。以下 11-05 双页面交付为当时发布记录，已被本节单页方案替代。

- 从远端最新 `main` `ec3c8c0` 新建 `codex/us-single-home-20261106` 与独立 `us-web-single-home` worktree，保护原 checkout。首页移除 Android 展示区和平台页签；旧 `/android/` 只保留 `noindex,follow`、canonical 指向首页的静态跳转至 `/#download`，并从 sitemap 移除。保留 8 条其他 URL、全部指南与政策路径。
- 已实际查看 `https://loopsplit.app/`，沿用“统一产品演示＋首尾双官方徽章”方式。首页 hero、末尾下载区与收费指南的商店 CTA 都使用原始官方 App Store／Google Play 徽章，Apple 在前；手机 Apple 徽章 40px、桌面 48px，保留比例和留白。导航 Download 只滚动到徽章，不做自制商店按钮；两个现有 iPhone campaign URL 保持原值。新增 `AGENTS.md` 固化用户规则。
- 首屏表达一键自动裁剪／白底、免费预览和美国区单次 JPEG `$1.99`／无订阅；真实前后对比旁就是下载入口。其后四项重点为自动处理、实际检查项目、本地照片处理和单次价格；保留 Google SDK／购买数据披露、平台权益独立及背景编辑限制。检查优势以像素、文件大小、头部／眼线比例和光照检查表达，没有虚构竞品排名或政府接受保证。
- **旧图矛盾与处理**：`ec3c8c0` 首页的 `appstore/inside-app-saved.png` 海报仍含 “Works for Every 2×2 Photo ID”，与现行用途／编辑限制不一致。检查旧图可复核此文字；本轮按用户重做营销展示的授权，在引用位置换为已有 iOS 1.1.5 原生素材，旧海报不再出现在当前页面。未修改 App Store 图片、应用或算法。
- 当前五张完整 iPhone 原生图来自 `VisaPhotoApps/Marketing/US/appstore/versions/1.1.5/repair-en-US-6.5/captures/en-US/6.5/`，与 Android worktree 所记 provenance SHA-256 一致。来源是已有 release screenshot replay，含 fixture 成片、原生检查与免扣款本地 StoreKit 测试；不冒充新生产交易。完整画面缩放转 WebP，共 495,372 字节；不裁剪、修图、重画或移除水印。03 图保留七行 checklist、Ready 和 PREVIEW；02／04 解锁状态保留；06 图为原生 12 张、六位不同人物，顺序不变；状态栏均为原生 09:41。来源、状态、源／输出哈希见 `assets/iphone/provenance.json`。
- `privacy.html`、`privacy-android.html`、`support.html`、`acquisition-campaigns.json` 与基线字节一致；Android 政策与应用 canonical 仍一致。未增加统计 SDK、事件采集或安装归因。静态 Tailwind 构建命令不变。
- 验收：首页首屏＋末尾下载区、收费指南均在 320/390/768/1440px 验证，0 横向溢出或已加载缺图；实际两商店目标核对、五项 FAQ、旧 Android URL 跳转通过，改动页未观察到控制台错误。原生画面、人物、状态和留白已逐图检查；8 条 sitemap、245 个站内引用和结构化数据通过。截图与回执在 `review/us-single-home-2026-11-06/`。本轮是 Chrome 视口验收，不含真实手机 Safari、生产安装／付款或竞品全面测试。
- 发布已完成：实现 `22989dd4a2482fcf639bbc644be35ad03fcf9459` 的 GitHub Pages 于 2026-11-06 18:01:04 UTC 构建／部署成功；21 个公开 HTTPS 页面／资源 200 且与提交字节一致。线上首页四宽度无溢出／缺图，未显示 Android 图，4 个官方徽章齐全；Download、See it work、旧 Android 地址、两政策、支持及指南徽章均复验通过。线上桌面／手机／末尾截图与两份 live 回执在同目录；无运行错误，未改 iPhone 隐私页仍有既有 Tailwind CDN 警告。验收访问不计作自然获客或安装。浏览器视口已恢复，本地预览服务已关闭。

## 2026-11-05 Android 上线后的双平台官网

本节为 11-05 当时网站状态；11-06 已按用户决定改为统一首页，见上节。下方 11-04 及更早记录保留其历史时间范围。基于远端 `main` 的 `949f048` 新建独立 worktree 和 `codex/us-dual-platform-20261105`，未合并旧 Android 预览分支，未触碰原 checkout 的未提交文件。本轮仅更新 US 网站，不修改应用、商店 listing、购买配置或其他国家网站。

- **发布依据与公开核验分别记录**：应用仓库 11-05 回执确认 US Android 1.0.0 (6) Production Published。随后实际打开美国区公开 Google Play 页面，看到 **US Visa Photo / Loop Apps**；未登录 Chrome 无痕窗口显示普通 **Install**，无需封测邀请。核验时间为 2026-11-05 21:24 Pacific（11-06 05:24 UTC）。这不是全球所有地区传播或实际安装的证明。详见 `review/us-dual-platform-2026-11-05/store-verification.json`。
- 首页提供官方 App Store、Google Play 徽章和手动平台导航；保留 iPhone 首页及指南原有 ASC campaign URL，购买与导出额度按平台独立。`/android/` 为可索引的英文正式页，展示实际 Android 流程、免费处理/预览及单次付费 JPEG 导出。美国区 Google Play About 对话框显示 `$1.99 per item`，美国区 App Store 当前描述写 `$1.99 per photo`；页面同时说明以当地商店购买前显示的价格为准。未实际安装或购买。
- Android 图像仅来自本次发布暂存目录 `android/build/play-release-submission-2026-11-05/upload-staging/us/en-US/phoneScreenshots/` 的 01、02、03、06；整图等比缩小转 WebP，共 288,884 字节，不裁剪、重绘、移除水印或改变购买状态。来源与输出 SHA-256、尺寸及官方徽章来源见 `android/assets/provenance.json`。七语素材仍以应用发布目录为准；本轮官网先交付英文。
- 文案按平台区分本地模型与 Apple 框架，明确 Android Google SDK 诊断和购买数据披露；保留背景替换／无纯裁剪导出限制、独立开发者身份及不保证官方接受的说明。未宣传打印排版或补光修正。
- `privacy.html`、`privacy-android.html`、`support.html`、`acquisition-campaigns.json` 与 `949f048` **字节一致**；Android 政策另与应用仓库最新 `android/play/privacy-android.html` 校验一致。没有用旧预览政策覆盖线上政策。原指南 URL 全部保留，sitemap 扩为 9 项。
- 首页 Tailwind 改为编译后静态 `assets/home.css`，不再运行 Tailwind CDN；更新 utility class 后执行 `bash scripts/build_home_css.sh`（固定 Tailwind 3.4.17）。`assets/platforms.css` 为双平台公共样式，Android 页不需要构建。既有 Lucide、Cloudflare 网站统计沿用；没有新增下载点击采集器，也不把访问量当安装量。下文旧 Tailwind CDN／营销导出说明仅适用于其历史工具和未改动页面。
- 验收：6 个主要页面 × 320/390/768/1440 px 共 24 组浏览器检查，无横向溢出或已加载缺图；实际点击两商店入口、平台导航、11 项 FAQ、支持与两份隐私政策链接。静态检查覆盖 9 个 HTML、268 个站内引用与锚点、结构化数据、9 条 sitemap URL 和素材哈希。证据与桌面／手机截图在 `review/us-dual-platform-2026-11-05/`。
- **验收范围**：Chrome 视口模拟，未另测真实 Safari/Android 浏览器；没有执行真实安装、支付或跨地区价格核验。改动页未观察到运行错误；未改动 iPhone 隐私页仍有既有 Tailwind CDN 生产环境警告，政策正文保持不变。
- **部署已验收**：沿用 GitHub Pages `main` 根目录，实现提交 `8dc229020aaeb9c793718931c245cd290f2adf9c`；Pages 在 2026-11-06 05:30:31 UTC 构建成功。19 个公开 HTTPS 页面／资源均返回 200 且与发布源字节一致；线上首页和 Android 页再跑 4 宽度共 8 组检查，未见溢出、缺图或本次控制台错误。平台导航和 FAQ 线上交互通过；桌面／手机线上截图及 `live-http-verification.json`、`live-browser-verification.json` 已入同一 review 目录。视口 override 已恢复。

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

Final visual review found the root FAQ details spacing affecting the language menu. Menu-specific spacing/font resets and centered header alignment now pass 16 focused homepage/language/viewport checks; the locale stylesheet URL is versioned for cache refresh. Evidence: review/multilingual-2026-11-11/header-alignment-qa.json.

### 中英文发布后验收 — 2026-11-11

内容 `cf7f988` 的 Pages workflow 于 2026-11-12 02:57:30 UTC 成功。19 个公开文件 200 且与提交字节一致；中文首页四宽度无溢出／已加载缺图，页头语言菜单位于安全区域，同主题中英切换及实际两商店入口通过，控制台未观察到错误。Google US sitemap 已 Success／13 个发现页面；Bing 更新进入 Processing／暂留旧 9 页；仅本轮变化的 11 个 HTML 地址通知 IndexNow，HTTP 200。上述不是页面收录或推荐证明。回执、定稿线上桌面／手机截图在 `review/multilingual-2026-11-11/`，主站另有八文件一致回读。QA 访问不计自然获客，真实手机 Safari／安装／付款仍未验证。

## 2026-11-11 Seven website languages

The owner approved the five remaining app languages for the root and US marketing websites: Traditional Chinese, Spanish, Japanese, German and French, alongside English and Simplified Chinese. This does not localize the other five country websites or change app releases, store metadata or policies.

`localization/config.json` now declares seven locale codes, native menu names and URL prefixes. Each topic has a static page in each language; the menu stays on the same topic. English remains the editable source, reviewed translations live in `localization/<code>.json`, and authored Chinese troubleshooting content uses explicit source overrides. Traditional Chinese was converted from the reviewed Simplified Chinese content with OpenCC s2twp and checked; it is not a separately commissioned native-speaker review. The generator needs only the existing BeautifulSoup build dependency. No translation service, new browser runtime dependency or automatic language redirect was added.

Rebuild with the documented `scripts/build_locales.py` command. Missing entries are reported by language before any output is written. Repeatability and deliberate missing-entry failure tests passed. The root filter uses per-language singular/plural count templates; all menus link to seven crawlable, self-canonical topic versions with complete reciprocal hreflang. Root sitemap: 7 URLs. US sitemap: 38 URLs, including the unchanged support and platform policy paths.

The 42 localized pages passed 168 Chrome viewport checks at 320/390/768/1440 pixels, with no horizontal overflow, completed broken image or out-of-header language control observed. All seven actual article switches and all seven localized Android filter counts passed. Static checks cover 2,116 internal targets/fragments. English policies are clearly labeled; support uses the existing matching language fragments. Official store badge artwork, native English iPhone captures, watermark/purchase state, policies and campaign URLs remain unchanged. Evidence is in `review/seven-languages-2026-11-11/`. Production and indexing receipts are now in the same review directory.

### Seven-language production acceptance

Root content `77e1ac5` and US content `6e59cf9` completed GitHub Pages deployment successfully at 2026-11-12 04:10:42/04:10:50 UTC. All 42 localized HTML pages and 15 supporting/compatibility files (57 total) return 200 and match source bytes. Representative root/US French homepages pass 390/1440px production checks; an actual US French-to-Japanese switch succeeds with seven language choices. Full local coverage remains 168 checks. A full production navigation batch timed out in the browser tool and unreturned measurements are excluded; representative checks were recovered without changing browser security or asking for Work settings. Production screenshots and the navigation limitation are recorded.

Google accepted both updated sitemaps. The US map is Success with 38 discovered pages; the root map temporarily retains Success with the previous 2 pages, versus 7 published. Bing progressed to Success/13 for the prior bilingual map, then accepted this update as Processing with the previous 13 shown. IndexNow received exactly the 35 changed US public HTML URLs, HTTP 200; unchanged policy/support URLs were excluded. Google priority crawl requests for the English US homepage and requirements guide both returned Indexing requested. These receipts do not establish page indexing, ranking or AI recommendation improvements. Observe the next crawl date and actual page state before attributing effects.
