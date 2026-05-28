# 小红书套装 · 美签 2×2 / DS-160

**正确目录：** `USVisaPhotoCom/marketing/xiaohongshu/`（不是 ChinaVisaPhotoCom）  
效果图：`effects/effect-01.png` … `effect-06.png`（你提供的 6 张成品）  
原图：`originals/demo-01-original.png` …（Post 1 上下对比用）  
App 截图：`screenshots/app-*.png`（Post 3–7，473×1024）  
导出：`npm run export` → `dist/xiaohongshu-us/post-1.png` … `post-7.png`

---

## 标题备选

1. **美签照片又被 CEAC 退了？我手机 $1.99 搞定 2×2 白底**
2. **Walgreens $16 vs App $1.99，DS-160 照片我自己出的**
3. **评论区「美签必过」领 1 次免费导出（见置顶）**

---

## 笔记正文（直接粘贴）

美签 DS-160 上传照片被退过的举个手 🙋

我踩过的坑：不是白底、头太大、JPEG 超 240KB、光线阴阳脸…  
后来用 iPhone 相册里一张普通自拍，本地抠白底 + 裁成 **1200×1200**，对着 **DS-160 清单**一条条打勾再 unlock。

**为啥不跑 Walgreens/CVS：**
- 常见 **$12-20+**，还要出门
- 重拍 = 再花钱再排队
- App **$1.99/张**，手机里处理导出（照片不上传云端）

**流程：** 选图 → 自动处理 → 导出 JPEG 上传 CEAC  
App Store 搜：**US Visa Photo**（iOS 17+）

**福利：** 评论区回复 **「美签必过」**，我私信 **App Store 兑换码**，**免费 unlock 导出 1 次**（和付费一样，完整 2×2）。

口令（可直接复制）：`美签必过`

---

## 评论区领券

| 项目 | 说明 |
|------|------|
| **口令** | `美签必过` |
| **权益** | 抵 1 次 unlock（约 $1.99），导出完整 2×2 / DS-160 用 |
| **限制** | **前 100 评论发码** · 每人 1 次 · 私信发码 |

### 置顶评论

🎁 评论区打 **「美签必过」**（四个字），我私信发 App Store 兑换码，**免费导出 1 次**。  
⌛️ **24 小时内没收到私信**：直接私信我（我补发）。  
⚠️ 别在评论里要码/留微信号；**前 100** 发完会在置顶下补「已发完」。

### 私信模板

> 你好～看到评论「美签必过」啦  
> 兑换码：`XXXX-XXXX-XXXX`  
> 打开 **US Visa Photo** → 处理照片 → **Unlock** 页输入 → 免费导出 1 次 2×2。  
> 祝面签顺利 🍀

---

## 每张图说什么（post-1 → post-7）

| 图 | 文件 | 内容 |
|----|------|------|
| 1 | post-1.png | **两人并排**：上原图（China 迁移 `originals/`）下你的 2×2 效果图（effect-01/02） |
| 2 | post-2.png | 6 张效果图墙（effect-03…06 + 01/02） |
| 3 | post-3.png | $1.99 vs Walgreens + 清单 / unlock |
| 4 | post-4.png | DS-160 清单 + 选图首页 |
| 5 | post-5.png | 三步隐私 + unlock / 下载分享（合并） |
| 6 | post-6.png | 全部已保存 + 再处理 |
| 7 | post-7.png | **美签必过** 领券 |

---

## 话题标签

#美签 #美国签证 #DS160 #CEAC #2x2照片 #签证照片 #留学签证 #F1签证 #H1B #在美生活 #iPhone技巧 #App推荐 #Walgreens

---

## 导出

```bash
cd USVisaPhotoCom/marketing/xiaohongshu
npm install
npx playwright install chromium   # 首次
npm run export
```

预览：`posts.html?post=1&scroll=1` · `preview.html`
