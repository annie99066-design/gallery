# AGENTS.md — 個人插畫作品集網頁開發規範書

## 1. 專案定位與核心原則 (Project Overview & Core Principles)
- **專案目的**：打造一個輕量、高留白、極具個人手繪風格的全螢幕獨立雙層式個人插畫作品集網頁（展示個人二創 Fanart 與視覺插畫作品、作者簡介與社群聯絡方式）。
- **核心設計理念**：以社群軟體（Instagram）為互動隱喻，結合現代瑞士排印（Swiss Editorial）巨型銳角字標、中段 46% 橫線分割與下方漫畫風大圓點網點（Halftone Screentone）、左上至右下貫穿對角雙虛線與縱向狹長四芒星裝飾，呈現兼具親切手繪感與前衛雜誌質感的線上藝廊體驗。
- **藝術資產與版權紅線（CRITICAL）**：
  - **嚴禁**使用任何 AI 生成圖片、外部圖庫佔位圖（如 Unsplash）或程式碼自動繪製插畫來替代作者作品。
  - **避免使用 `ORIGINAL` 字樣**：全站作品多為粉絲二創（Fanart），全站介面文案、副標題與預設標籤**嚴禁**出現 `ORIGINAL` 或 `ORIGINAL ARTWORK` 等宣稱原創版權之字樣，統一採用 `ILLUSTRATION`、`FANART`、`VISUAL ARCHIVE`、`STUDIO` 等中性藝術詞彙。
  - 若圖片檔案尚未就緒，前端僅能渲染純色幾何佔位框並標示檔案路徑提示，方便作者後續補圖。

---

## 2. 技術棧與 GitHub Pages 部署規範 (Tech Stack & Deployment)
- **前端架構**：純靜態網頁（HTML5 + Tailwind CSS CDN + Vanilla JavaScript），零後端與零打包框架依賴。
- **資料模組化（零伺服器 CORS 相容）**：全站文字、作者資料、圓圈列配置與 39 幅畫作清單統一集中管理於 `js/portfolio-data.js`（以全域常數 `window.PORTFOLIO_DATA` 匯出），完全不使用 `fetch()` 讀取本地 JSON，確保本地雙擊 `index.html` 或直接部署至 GitHub Pages 皆能零報錯秒開。
- **GitHub Pages 相對路徑規範**：所有圖片、樣式與腳本引用**必須嚴格使用 `./` 開頭的相對路徑**（例如 `./assets/artworks/rain.png`、`<script src="./js/app.js"></script>`），**嚴禁**使用根目錄絕對路徑 `/assets/...`。
- **字型與外部依賴**：字型引用 Google Fonts `Cinzel`（700, 900），樣式採用 Tailwind CSS CDN，圖示全部採用內嵌式輕量向量 SVG，無額外依賴。

---

## 3. 目錄結構與檔案清單 (Directory Structure)
```text
/
├── index.html                      # 主頁面（含 Loading 遮罩、第一層主舞台、第二層獨立輪播層、三種彈窗）
├── AGENTS.md                       # 本專案 AI 協作與開發規範書
├── js/
│   ├── portfolio-data.js           # 【核心資料庫】全站文字、作者資料、故事圓圈列配置與 39 幅畫作資料
│   └── app.js                      # 【核心控制器】拖拽滑動、雙層單頁切換、隨機洗牌輪播、放大鏡縮圖、防盜
└── assets/
    ├── ui/                         # 介面與裝飾小素材 (.png)
    │   ├── Gigi_cat.PNG            # 作者頭像 / Loading 素材 1
    │   ├── Hana_cat.PNG            # 裝飾圓圈 1 圖片 / Loading 素材 2
    │   ├── bamby.PNG               # 裝飾圓圈 2 圖片
    │   └── noah.PNG                # 備用介面素材
    ├── bg/                         # 背景圖檔
    │   └── bg.png                  # 第二層分類展間背景圖（車站夕陽，程式自動套用暗色與毛玻璃渲染）
    └── artworks/                   # 正式展示畫作（39 幅精選作品）
        ├── rain.png                # 首頁手機框主推代表作 / 其他分類代表作
        ├── wilson.PNG              # 標準Q 分類代表作
        ├── K_chann.PNG             # 正比人物 分類代表作
        ├── sunset_rafel.PNG        # 高挑/場景QQ人 分類代表作
        ├── 2boys.PNG               # 迷你立繪 分類代表作
        └── ... (其餘收錄作品)
```

---

## 4. 頁面視覺風格與雙層獨立切換架構 (Visual Aesthetics & Architecture)

### 4.1 全程零垂直捲軸（100vh Fullscreen Single-Page Mode）
- 全站 `html, body` 鎖定 `width: 100vw; height: 100vh; overflow: hidden !important;`，徹底杜絕滑鼠垂直捲軸與頁面上下位移。
- 進入網站時，僅呈現乾淨的第一層（`#layerHome`），第二層（`#layerGallery`）預設完全隱藏（`hidden`），絕不接在第一層下方露出。

### 4.2 Loading 載入動畫層 (`#loadingScreen`)
- 純白滿版遮罩，置中展示 `Gigi_cat.PNG` 與 `Hana_cat.PNG` 以 `0.34s` 間隔交替彈跳（`translateY(-13px)`）。
- 下方顯示兩行極簡英文等待文字（`CURATING STUDIO ARCHIVE...` 與 `LOADING ARTWORKS`）。

### 4.3 第一層：電腦橫式單頁主舞台 (`#layerHome`)
- **嚴格 Z-Index 圖層層次（不可顛倒）**：
  1. **`z-0`：中段 46% 實心橫線 ＋ 下方大圓點網點帶（Halftone Screentone）**：
     - 在畫面中段（視窗高度 `top: 46%` 處）橫跨一條實心深灰橫線（`border-t-2 border-[#888888]`）。
     - **橫線上方**（0%~46%）：維持 `#FFFFFF` 純白高留白背景，零任何背景雜點。
     - **橫線下方**（46%~100%）：填滿較大直徑（7px / 3.5px 半徑）、排列勻稱的漫畫風格灰階大圓點（`#858585`，`background-size: 20px 20px`）。
  2. **`z-10`：背景幾何裝飾與巨型瑞士排印**：
     - **對角雙虛線系統**：自左上方貫穿至右下方的平行雙虛線（`dashed lines`，`stroke="#949494"`）。
     - **四芒星配置**：
       - 左上方虛線上串連兩顆空心狹長四芒星（一大一小，位於字標下方與中左）。
       - 右下方虛線上串連兩顆空心狹長四芒星（一大一小，橫跨右側網點帶）。
       - 左右視窗邊界處配置深灰實心狹長四芒星（`#525252`），貼齊邊緣呈現俐落出血裁切效果。
     - **左對齊巨型銳角字標**：頂部左側配置超大號瑞士字標 `GALLERY`（Cinzel 字體，垂直延展 `scaleY(1.18)`，字級 `16vw / 11.5vw / 10vw`，色彩為質感深灰 `#484848`），下方緊跟副標題 `ILLUSTRATION & FANART VISUAL ARCHIVE`。
  3. **`z-20`：右側作者社群資訊 ＆ 中央偏下方剪角長方形手繪手機框**：
     - **右側作者資訊區**：位於 46% 橫線上方約 10px 處，靠右對齊展示【Rika】大字標題，下方列出作者正經營的兩組 X 帳號（`𝕏 @rika_7sec`、`𝕏 @hururu_drawww`，前置 X 官方標準向量剪影圖標，點擊外連跳轉）。
     - **手繪手機框核心結構**：
       - **貼底切平無底線**：手機容器採用 `absolute bottom-0 left-1/2 -translate-x-1/2`，直接由視窗底緣向上生長，底部與視窗底邊齊平（無底邊橫框線）。
       - **連續 SVG Polyline 粗邊框**：頂部外圍採用連續 `<polyline>` 繪製粗邊框（`stroke-width: 7px`，深灰 `#484848`，左底端 → 左斜角折點 → 頂橫線 → 右斜角折點 → 右底端），完全不斷線。
       - **嚴格斜角 Clip-Path 裁切**：內部內容主體套用精確頂部雙斜折角 `clip-path` 與 `overflow: hidden`，內部所有圖片絕不超出外框。
       - **全面向內縮排（呼吸留白）**：狀態列、標題列、圓圈列、貼文作者欄與主推代表作大圖四周均內縮約 20px，與黑色外框保持乾淨均勻的白色邊界。
       - **「比正方形稍高」黃金比例**：露出高度約 `64vh`（約 1 : 1.3 比例），主推大圖（`rain.png`）採用滿寬貼頂渲染，自然完整露出最精華的上半身面部細節（約 1/3 至 1/2 畫面），下半部隨手機框於視窗底緣俐落切除。

### 4.4 第二層：全螢幕獨立分類作品輪播層 (`#layerGallery`)
- **獨立畫面切換**：
  - 進入方式：在首頁手機框內點擊任一「作品分類圓圈」或「代表作大圖」時，`#layerHome` 隱藏，`#layerGallery` 滿版顯示（`fixed inset-0`）。
  - 返回方式：點擊第二層左上角 **`← BACK`** 按鈕（或鍵盤直接按 **`ESC`**），瞬間切換回首頁。
- **頂部分類標籤列（#categoryTabs）**：
  - 置中橫向排列：`[ ALL ]`、`[ 標準Q ]`、`[ 正比人物 ]`、`[ 高挑/場景QQ人 ]`、`[ 迷你立繪 ]`、`[ 其他 ]`。
  - 當前選中的分類標籤自動反白高亮（`bg-white text-neutral-900 shadow-md`）。
- **三聯焦點輪播結構**：
  - **中央主畫作 (A)**：完整純淨原彩展示，無網點濾鏡，帶有立體懸浮投影（`floating-artwork-shadow`）。
  - **左右兩側出血畫作 (A-1) 與 (A+1)**：貼齊螢幕兩側各露出約 1/4 幅寬，上方鋪設白色微點陣濾鏡（`white-dot-filter`）以襯托主體，點擊兩側畫作即可直接切換。
  - **放大鏡分類總覽彈窗 (`#categoryGridModal`)**：中央主畫作正下方配置圓形放大鏡按鈕，點擊後彈出當前分類所有作品的網格縮圖總覽，點擊縮圖即可直接跳轉至該幅畫作。

---

## 5. 互動邏輯與演算法規則 (Interaction & Algorithm Guardrails)

### 5.1 Stories 圓圈列配置與拖曳防誤觸機制
- **圓圈列組成（共 8 個項目，依序排列）**：
  1. `about`：作者圓圈（帶右下角黑點），點擊打開作者自介與聯絡方式彈窗（`#aboutModal`）。
  2. `00`（純裝飾）：圖片 `Hana_cat.PNG`，不可點擊跳轉，支援 Hover 微放大。
  3. `_quities.1000`：分類「標準Q」，代表圖 `wilson.PNG`。
  4. `_love.OvO_`：分類「正比人物」，代表圖 `K_chann.PNG`。
  5. `> <`（純裝飾）：圖片 `bamby.PNG`，不可點擊跳轉，支援 Hover 微放大。
  6. `q.q.tall`：分類「高挑/場景QQ人」，代表圖 `sunset_rafel.PNG`。
  7. `mini_prof_`：分類「迷你立繪」，代表圖 `2boys.PNG`。
  8. `graff/c_deco`：分類「其他」，代表圖 `rain.png`。
- **滑鼠左鍵拖曳滑動（Drag-to-scroll）**：
  - 容器監聽 `mousedown`, `mousemove`, `mouseup`, `mouseleave` 與橫向滾輪，原生捲軸完全隱藏。
  - 游標預設為 `cursor: grab`，按住拖動時切換為 `cursor: grabbing`。
- **5px 智能防誤觸判定**：
  - 滑鼠拖曳位移大於 5px 立即標記為拖動狀態（`isStoriesDragging = true`），並在 capture 階段攔截 `click` 事件。
  - 只有原地輕點（位移 ≤ 5px）才會正常觸發跳轉，拖動圓圈列時絕對不會誤觸分類。
- **Hover 微放大動態效果**：
  - 滑鼠懸停於任一圓圈時，圓圈本體平滑放大 10%（`scale-110`），移開自然還原。

### 5.2 貼文作者資訊聯動
- 點擊手機貼文欄上方的作者頭貼、`rika` 名字或向量貓咪頭時，同樣會打開與點擊 `about` 圓圈完全相同的作者資訊彈窗。

### 5.3 跨分類隨機輪播演算法（Shuffle Algorithm）
- **代表作品固定首位展示**：
  - 切換至任一分類時，該分類的圓圈代表圖片**保證固定排在第 1 幅**（如迷你立繪第 1 幅必為 `2boys`，其他分類第 1 幅必為 `rain`）。
- **其餘作品隨機洗牌**：
  - 該分類扣除代表作品後的所有作品，每次進入時透過 Fisher-Yates 演算法進行隨機亂序排列。
  - ALL 模式下首張固定為首頁代表作 `rain`，其餘 38 幅畫作全隨機排序。
- **跨分類連續無縫輪播**：
  - 在某分類最後一張按 `NEXT →` 時自動無縫前進至下一分類第一張；反之在第一張按 `← PREV` 返回上一分類最後一張，循環不斷線。

### 5.4 快速鍵與觸控手勢
- 支援鍵盤左/右方向鍵換頁、Touch Swipe 左右滑动手勢切換輪播、按 `ESC` 關閉所有彈窗或自第二層返回首頁。

---

## 6. 全站文字區塊與資料配置對照表 (`js/portfolio-data.js`)
畫面上所有文案與作品資料均集中在 `js/portfolio-data.js` 中修改，禁止在 HTML 中寫死重複項目：

| 區塊編號 | 資料欄位路徑 (`PORTFOLIO_DATA.*`) | 畫面對應位置 | 設定範例與規則 |
| :--- | :--- | :--- | :--- |
| **TXT-01** | `texts.loadingPrimary` | Loading 主等待文字 | `"CURATING STUDIO ARCHIVE..."` |
| **TXT-02** | `texts.loadingSecondary` | Loading 副等待文字 | `"LOADING ARTWORKS"` |
| **TXT-03** | `texts.heroWordmark` | 首頁頂部巨型字標 | `"GALLERY"` |
| **TXT-04** | `texts.heroSubtitle` | 首頁頂部副標題 | **禁止包含 `ORIGINAL`**，`"ILLUSTRATION & FANART VISUAL ARCHIVE"` |
| **TXT-05** | `texts.phoneStatusTime` | 手機狀態列時間 | `"9:26"` |
| **TXT-06** | `texts.phoneHeaderTitle` | 手機頂部中間標題 | `"Sketch"` |
| **TXT-07** | `artist.handle` | 貼文欄作者名稱 | `"rika"` |
| **TXT-08** | `featuredArtwork.subtitle` | 貼文欄音樂符號小字 | `"It's a seerect"` |
| **TXT-09** | `artist.role` / `artist.bio` | 作者彈窗頭銜與自介 | 英文職稱與簡短個人簡介 |
| **TXT-10** | `artist.socials[]` | 作者彈窗社群連結 | 包含 `X: @rika_7sec` 與 `X: @hururu_drawww` |
| **TXT-11** | `storyItems[].label` | 圓圈列下方顯示名稱 | 如 `_quities.1000`、`_love.OvO_`、`00` 等 |
| **TXT-12** | `storyItems[].tabLabel` | 第二層頂部分類標籤 | 如 `標準Q`、`正比人物`、`迷你立繪` 等 |
| **TXT-13** | `artworks[].title / desc` | 第二層畫作資訊詳情 | 39 幅作品獨立之標題、年份、媒材與簡述 |

---

## 7. 防盜保護與 GitHub Pages 交付守則 (Security & AI Guardrails)
1. **畫作防盜強制執行**：全站所有 `<img>` 標籤皆強制賦予 `draggable="false"` 與 `oncontextmenu="return false;"`；中央畫作容器帶有透明防護層，防止右鍵另存或滑鼠直接拖曳圖片。
2. **新增內容 SOP**：未來若需增減畫作或調整分類，**只能修改 `js/portfolio-data.js`**，嚴禁在 `index.html` 內手動複製重複結構。
3. **GitHub Pages 零報錯檢查**：
   - 確保所有檔案名稱大小寫與程式碼內完全一致（符合 Linux 環境區分大小寫規範）。
   - 確保無任何本地絕對路徑，純靜態運作無需 Node.js / Python 伺服器支援。
