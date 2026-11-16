/* ============================================================
 *  portfolio-data.js — All text, image paths & artwork metadata
 *  Exposed as window.PORTFOLIO_DATA (no fetch / no JSON / no CORS)
 * ============================================================ */
window.PORTFOLIO_DATA = {

  /* ── Texts (TXT-01 ~ TXT-06) ─────────────────────────────── */
  texts: {
    loadingPrimary:   "CURATING STUDIO ARCHIVE...",   // TXT-01
    loadingSecondary: "LOADING ARTWORKS",             // TXT-02
    heroWordmark:     "GALLERY",                      // TXT-03
    heroSubtitle:     "ILLUSTRATION & FANART VISUAL ARCHIVE", // TXT-04 (NO "ORIGINAL")
    phoneStatusTime:  "9:26",                         // TXT-05
    phoneHeaderTitle: "Sketch"                        // TXT-06
  },

  /* ── Artist Profile (TXT-07 ~ TXT-10) ───────────────────── */
  artist: {
    handle:      "rika",                              // TXT-07
    displayName: "RIKA",
    role:        "ILLUSTRATOR & FANART CREATOR",      // TXT-09
    bio:         "Independent illustrator focusing on crisp flat-color aesthetics, character silhouettes, and stylized visual storytelling.",
    email:       "hello@example.com",                 // TXT-10
    avatar:      "./assets/ui/Gigi_cat.PNG",
    socials: [
      { label: "X: @rika_7sec", url: "https://x.com/rika_7sec" },
      { label: "X: @hururu_drawww", url: "https://x.com/hururu_drawww" }
    ]
  },

  /* ── Loader Sprites ──────────────────────────────────────── */
  loaderSprites: [
    "./assets/ui/Gigi_cat.PNG",
    "./assets/ui/Hana_cat.PNG"
  ],

  /* ── Background ──────────────────────────────────────────── */
  layer2Background: "./assets/bg/bg.png",

  /* ── Featured Artwork (hero phone) ───────────────────────── */
  featuredArtwork: {
    image:           "./assets/artworks/rain.png",
    subtitle:        "It's a seerect",                // TXT-08
    targetArtworkId: "w-oth-01"
  },

  /* ── Stories Carousel Items (TXT-11) ─────────────────────── */
  storyItems: [
    {
      type: "about",
      label: "about",
      image: "./assets/ui/Gigi_cat.PNG"
    },
    {
      type: "deco",
      label: "00",
      image: "./assets/ui/Hana_cat.PNG"
    },
    {
      type: "category",
      categoryId: "cat-std-q",
      tabLabel: "標準Q",
      label: "_quities.1000",
      image: "./assets/artworks/wilson.PNG"
    },
    {
      type: "category",
      categoryId: "cat-normal-scale",
      tabLabel: "正比人物",
      label: "_love.OvO_",
      image: "./assets/artworks/K_chann.PNG"
    },
    {
      type: "deco",
      label: "> <",
      image: "./assets/ui/bamby.PNG"
    },
    {
      type: "category",
      categoryId: "cat-tall-scene",
      tabLabel: "高挑/場景QQ人",
      label: "q.q.tall",
      image: "./assets/artworks/sunset_rafel.PNG"
    },
    {
      type: "category",
      categoryId: "cat-mini-chibi",
      tabLabel: "迷你立繪",
      label: "mini_prof_",
      image: "./assets/artworks/2boys.PNG"
    },
    {
      type: "category",
      categoryId: "cat-other",
      tabLabel: "其他",
      label: "graff/c_deco",
      image: "./assets/artworks/rain.png"
    }
  ],

  /* ── Artworks Gallery (TXT-12) ───────────────────────────── */
  artworks: [
    // ═══════════════════════════════════════════════════════════
    // 分類 1: 標準Q (_quities.1000) - 12 Works
    // ═══════════════════════════════════════════════════════════
    {
      id: "w-stdq-01",
      categoryId: "cat-std-q",
      title: "Wilson",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/wilson.PNG",
      desc: "Chibi character illustration of Wilson."
    },
    {
      id: "w-stdq-02",
      categoryId: "cat-std-q",
      title: "Vanta",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/vanta.PNG",
      desc: "Chibi character study of Vanta."
    },
    {
      id: "w-stdq-03",
      categoryId: "cat-std-q",
      title: "Zali",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/zali.PNG",
      desc: "Chibi character portrait of Zali."
    },
    {
      id: "w-stdq-04",
      categoryId: "cat-std-q",
      title: "Purple",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/purple.PNG",
      desc: "Purple palette stylized chibi portrait."
    },
    {
      id: "w-stdq-05",
      categoryId: "cat-std-q",
      title: "New Year",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/newyear.PNG",
      desc: "New year themed celebratory chibi artwork."
    },
    {
      id: "w-stdq-06",
      categoryId: "cat-std-q",
      title: "Ness",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/ness.PNG",
      desc: "Chibi illustration of Ness."
    },
    {
      id: "w-stdq-07",
      categoryId: "cat-std-q",
      title: "Luxiem",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/luxiem.PNG",
      desc: "Luxiem group members chibi composition."
    },
    {
      id: "w-stdq-08",
      categoryId: "cat-std-q",
      title: "Kitami",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/kitami.PNG",
      desc: "Character portrait study of Kitami."
    },
    {
      id: "w-stdq-09",
      categoryId: "cat-std-q",
      title: "Kaisei",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/Kaisei.PNG",
      desc: "Stylized chibi illustration of Kaisei."
    },
    {
      id: "w-stdq-10",
      categoryId: "cat-std-q",
      title: "Study 2096(1)",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/IMG_2096(1).PNG",
      desc: "Detailed expressive character sketch."
    },
    {
      id: "w-stdq-11",
      categoryId: "cat-std-q",
      title: "Alban",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/alban.PNG",
      desc: "Chibi character portrait of Alban Knox."
    },
    {
      id: "w-stdq-12",
      categoryId: "cat-std-q",
      title: "Claud",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/claud.PNG",
      desc: "Chibi character illustration of Claud."
    },

    // ═══════════════════════════════════════════════════════════
    // 分類 2: 正比人物 (_love.OvO_) - 8 Works
    // ═══════════════════════════════════════════════════════════
    {
      id: "w-norm-01",
      categoryId: "cat-normal-scale",
      title: "Vox",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/Vox.PNG",
      desc: "Full-scale character portrait of Vox Akuma."
    },
    {
      id: "w-norm-02",
      categoryId: "cat-normal-scale",
      title: "Shu",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/shu.PNG",
      desc: "Full-scale illustration study of Shu Yamino."
    },
    {
      id: "w-norm-03",
      categoryId: "cat-normal-scale",
      title: "Ren Chocolate",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/ren_choco.PNG",
      desc: "Valentine chocolate themed portrait of Ren Zotto."
    },
    {
      id: "w-norm-04",
      categoryId: "cat-normal-scale",
      title: "Naruse",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/naruse.PNG",
      desc: "Full-scale character portrait of Naruse."
    },
    {
      id: "w-norm-05",
      categoryId: "cat-normal-scale",
      title: "K Channel",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/K_chann.PNG",
      desc: "Featured portrait study for K Channel."
    },
    {
      id: "w-norm-06",
      categoryId: "cat-normal-scale",
      title: "Fly Yellow",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/fly_yel.PNG",
      desc: "Yellow-palette dynamic floating character illustration."
    },
    {
      id: "w-norm-07",
      categoryId: "cat-normal-scale",
      title: "Fly Orange",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/fly_oran.PNG",
      desc: "Orange-palette dynamic floating character illustration."
    },
    {
      id: "w-norm-08",
      categoryId: "cat-normal-scale",
      title: "Freo",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/freo.PNG",
      desc: "Full-scale character portrait study of Freo."
    },

    // ═══════════════════════════════════════════════════════════
    // 分類 3: 高挑/場景QQ人 (q.q.tall) - 10 Works
    // ═══════════════════════════════════════════════════════════
    {
      id: "w-tall-01",
      categoryId: "cat-tall-scene",
      title: "Sunset Rafel",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/sunset_rafel.PNG",
      desc: "Rafel character portrait bathed in warm sunset hues."
    },
    {
      id: "w-tall-02",
      categoryId: "cat-tall-scene",
      title: "Ren",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/ren.PNG",
      desc: "Elongated silhouette composition of Ren."
    },
    {
      id: "w-tall-03",
      categoryId: "cat-tall-scene",
      title: "Noah Lineart",
      year: "2026",
      medium: "Line Art",
      image: "./assets/artworks/noah_line.PNG",
      desc: "Crisp lineart silhouette study of Noah."
    },
    {
      id: "w-tall-04",
      categoryId: "cat-tall-scene",
      title: "Bamby Lineart",
      year: "2026",
      medium: "Line Art",
      image: "./assets/artworks/bamby_line.PNG",
      desc: "Detailed lineart study of Bamby."
    },
    {
      id: "w-tall-05",
      categoryId: "cat-tall-scene",
      title: "Chronoir",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/chronoir.PNG",
      desc: "Stage performance dual character illustration of Chronoir."
    },
    {
      id: "w-tall-06",
      categoryId: "cat-tall-scene",
      title: "1st Rafel",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/1st_rafel.PNG",
      desc: "First edition character composition of Rafel."
    },
    {
      id: "w-tall-07",
      categoryId: "cat-tall-scene",
      title: "Naruse Christmas",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/naruse_christmas.PNG",
      desc: "Christmas holiday edition illustration of Naruse."
    },
    {
      id: "w-tall-08",
      categoryId: "cat-tall-scene",
      title: "Murakumo",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/murakumo.PNG",
      desc: "Stylized character silhouette study of Murakumo."
    },
    {
      id: "w-tall-09",
      categoryId: "cat-tall-scene",
      title: "Goodnight Boys",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/Goodnight_boys.PNG",
      desc: "Night atmosphere scenic dual character illustration."
    },
    {
      id: "w-tall-10",
      categoryId: "cat-tall-scene",
      title: "Rafel Shark",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/rafel_shark.PNG",
      desc: "Playful shark hoodie themed character artwork of Rafel."
    },

    // ═══════════════════════════════════════════════════════════
    // 分類 4: 迷你立繪 (mini_prof_) - 5 Works
    // ═══════════════════════════════════════════════════════════
    {
      id: "w-mini-01",
      categoryId: "cat-mini-chibi",
      title: "Plave Red",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/Plave_red.PNG",
      desc: "Warm red palette Plave mini profile sticker illustration."
    },
    {
      id: "w-mini-02",
      categoryId: "cat-mini-chibi",
      title: "Plave Blue",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/Plave_blue.PNG",
      desc: "Cool blue palette Plave mini profile sticker illustration."
    },
    {
      id: "w-mini-03",
      categoryId: "cat-mini-chibi",
      title: "Two Boys",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/2boys.PNG",
      desc: "Dual character chibi duo standing profile artwork."
    },
    {
      id: "w-mini-04",
      categoryId: "cat-mini-chibi",
      title: "3SKM",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/3SKM.PNG",
      desc: "Trio standing mini profile character illustration."
    },
    {
      id: "w-mini-05",
      categoryId: "cat-mini-chibi",
      title: "Hamin 2",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/hamin_2.PNG",
      desc: "Standing mini profile character illustration of Hamin."
    },

    // ═══════════════════════════════════════════════════════════
    // 分類 5: 其他 (graff/c_deco) - 4 Works
    // ═══════════════════════════════════════════════════════════
    {
      id: "w-oth-01",
      categoryId: "cat-other",
      title: "Rain",
      year: "2026",
      medium: "Digital Illustration",
      image: "./assets/artworks/rain.png",
      desc: "Rainy mood atmosphere graphic deco artwork."
    },
    {
      id: "w-oth-02",
      categoryId: "cat-other",
      title: "Peek",
      year: "2026",
      medium: "Digital Illustration",
      image: "./assets/artworks/peek.PNG",
      desc: "Peeking character graphic deco study."
    },
    {
      id: "w-oth-03",
      categoryId: "cat-other",
      title: "Eyes Study",
      year: "2026",
      medium: "Digital Study",
      image: "./assets/artworks/eyes.png",
      desc: "Expressive anime eye rendering graphic study."
    },
    {
      id: "w-oth-04",
      categoryId: "cat-other",
      title: "Cats Genshin",
      year: "2026",
      medium: "Digital Fanart",
      image: "./assets/artworks/cats_genshin.PNG",
      desc: "Genshin Impact cat-themed playful illustration."
    }
  ]
};
