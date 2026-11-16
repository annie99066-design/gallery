/* ============================================================
 *  app.js — Pure Vanilla JS Controller
 *  Features:
 *  - Fullscreen single-page mode (Zero vertical scroll)
 *  - Bottom-flushed chamfered phone frame with unbroken SVG border (NO bottom line)
 *  - Featured artwork displaying top 1/3 ~ 1/2, cleanly clipped by bottom edge
 *  - Layer 1 (Home) <-> Layer 2 (Gallery) independent screen switching
 *  - Stories drag-to-scroll with click vs drag discrimination (threshold: 5px)
 *  - Cross-category continuous carousel & auto-highlighted tabs
 *  - Category grid overview modal (magnifier button)
 *  - Full anti-piracy protections
 * ============================================================ */
(function () {
  "use strict";
  const D = window.PORTFOLIO_DATA;
  if (!D) { console.error("PORTFOLIO_DATA not found"); return; }

  /* ── Helpers ─────────────────────────────────────────────── */
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

  function safeImg(src, alt, cls) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.className = cls || "";
    img.draggable = false;
    img.setAttribute("oncontextmenu", "return false;");
    img.style.userSelect = "none";
    img.style.webkitUserSelect = "none";
    img.style.pointerEvents = "auto";
    return img;
  }

  /* ── Global State ────────────────────────────────────────── */
  let currentArtworkIndex = 0;
  let filteredArtworks = [...D.artworks];
  let activeCategory = "all";
  let isStoriesDragging = false; // Flag for drag-vs-click discrimination

  /* ── 1. Loading Screen ───────────────────────────────────── */
  function initLoading() {
    const screen = $("#loadingScreen");
    if (!screen) return;
    const primary = $("#loadingPrimary");
    const secondary = $("#loadingSecondary");
    const spriteEl = $("#loaderSprite");

    if (primary)   primary.textContent   = D.texts.loadingPrimary;
    if (secondary) secondary.textContent = D.texts.loadingSecondary;

    if (spriteEl && D.loaderSprites.length >= 2) {
      let frame = 0;
      spriteEl.src = D.loaderSprites[0];
      const spriteTimer = setInterval(() => {
        frame = 1 - frame;
        spriteEl.src = D.loaderSprites[frame];
        spriteEl.style.transform = frame ? "translateY(-13px)" : "translateY(0)";
      }, 340);

      const start = Date.now();
      Promise.all(
        D.artworks.slice(0, 8).map(a => new Promise(r => {
          const i = new Image(); i.onload = i.onerror = r; i.src = a.image;
        }))
      ).then(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 1400 - elapsed);
        setTimeout(() => {
          clearInterval(spriteTimer);
          screen.style.transition = "opacity .5s ease";
          screen.style.opacity = "0";
          setTimeout(() => {
            screen.style.display = "none";
            updatePhoneBorder();
          }, 500);
        }, remaining);
      });
    }
  }

  /* ── 2. Hero / Layer 1 (Home) & Phone Frame ──────────────── */
  function updatePhoneBorder() {
    const phone = $("#phoneContainer");
    const polyline = $("#phoneBorderPolyline");
    if (!phone || !polyline) return;

    const w = phone.offsetWidth;
    const h = phone.offsetHeight;
    if (w <= 0 || h <= 0) return;

    const cut = 28; // 28px chamfer corner size
    const offset = 3.5; // Half of stroke-width 7px

    // Unbroken polyline: Bottom-Left -> Top-Left Chamfer -> Top edge -> Top-Right Chamfer -> Bottom-Right
    // Extends 8px past bottom edge to ensure a clean flush cut with ZERO bottom border line
    const pts = [
      `${offset},${h + 8}`,
      `${offset},${cut}`,
      `${cut},${offset}`,
      `${w - cut},${offset}`,
      `${w - offset},${cut}`,
      `${w - offset},${h + 8}`
    ].join(" ");

    polyline.setAttribute("points", pts);
  }

  function initHero() {
    const wordmark  = $("#heroWordmark");
    const subtitle  = $("#heroSubtitle");
    const time      = $("#phoneStatusTime");
    const header    = $("#phoneHeaderTitle");
    const postAv    = $("#postAuthorAvatar");
    const postName  = $("#postAuthorHandle");
    const postSub   = $("#postAudioSubtitle");
    const featImg   = $("#featuredImg");
    const featCard  = $("#featuredArtworkCard");

    if (wordmark) wordmark.textContent = D.texts.heroWordmark;
    if (subtitle) subtitle.textContent = D.texts.heroSubtitle;
    if (time)     time.textContent     = D.texts.phoneStatusTime;
    if (header)   header.textContent   = D.texts.phoneHeaderTitle;

    if (postAv)   { postAv.src = D.artist.avatar; postAv.draggable = false; }
    if (postName) postName.textContent = D.artist.handle;
    if (postSub)  postSub.textContent  = D.featuredArtwork.subtitle;

    if (featImg) {
      featImg.src = D.featuredArtwork.image;
      featImg.draggable = false;
      featImg.setAttribute("oncontextmenu", "return false;");
    }

    // Click featured artwork on phone to enter Layer 2 directly
    if (featCard) {
      featCard.addEventListener("click", () => {
        const targetId = D.featuredArtwork.targetArtworkId;
        const found = D.artworks.find(a => a.id === targetId);
        if (found) {
          showLayerGallery(found.categoryId, found.id);
        } else {
          showLayerGallery("all");
        }
      });
    }

    // Click post author profile to open About modal
    const postAuthorBtn = $("#postAuthorProfileBtn");
    if (postAuthorBtn) {
      postAuthorBtn.addEventListener("click", () => {
        openAboutModal();
      });
    }

    // Observe phone resize to dynamically adapt border
    window.addEventListener("resize", updatePhoneBorder);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => updatePhoneBorder());
      const phone = $("#phoneContainer");
      if (phone) ro.observe(phone);
    }
  }

  /* ── 3. Stories Carousel (Drag-to-Scroll + Click Protection) ── */
  function initStories() {
    const container = $("#storiesCarousel");
    if (!container) return;
    container.innerHTML = "";

    // Render items
    D.storyItems.forEach((item) => {
      const isDeco = item.type === "deco";
      const wrapper = document.createElement("button");
      wrapper.className = isDeco
        ? "flex-shrink-0 flex flex-col items-center gap-1 focus:outline-none select-none transition-transform group cursor-default"
        : "flex-shrink-0 flex flex-col items-center gap-1 focus:outline-none select-none transition-transform group cursor-pointer active:scale-95";

      // Ring
      const ring = document.createElement("div");
      ring.className = "relative w-[52px] h-[52px] md:w-[58px] md:h-[58px] rounded-full p-[2px] bg-gradient-to-br from-neutral-300 via-neutral-400 to-neutral-600 flex items-center justify-center shrink-0 transition-transform duration-200 ease-out group-hover:scale-110";

      const inner = document.createElement("div");
      inner.className = "w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center";

      const img = safeImg(item.image, item.label || "", "w-full h-full object-cover pointer-events-none");
      inner.appendChild(img);
      ring.appendChild(inner);

      // Dot badge for "about" type
      if (item.type === "about") {
        const dot = document.createElement("span");
        dot.className = "absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#1e1e1e] border-2 border-white rounded-full";
        ring.appendChild(dot);
      }

      wrapper.appendChild(ring);

      // Label
      if (item.label) {
        const lbl = document.createElement("span");
        lbl.className = "text-[9px] md:text-[10px] tracking-wide font-medium text-neutral-600 max-w-[78px] truncate select-none text-center";
        lbl.textContent = item.label;
        wrapper.appendChild(lbl);
      }

      // Click handlers (guarded against drag)
      if (item.type === "about") {
        wrapper.addEventListener("click", () => {
          if (isStoriesDragging) return;
          openAboutModal();
        });
      } else if (item.type === "category") {
        wrapper.addEventListener("click", () => {
          if (isStoriesDragging) return;
          showLayerGallery(item.categoryId);
        });
      }

      container.appendChild(wrapper);
    });

    // ── Mouse Drag-to-Scroll Implementation ──
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let dragDistance = 0;

    container.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // Only primary mouse button
      isDown = true;
      isStoriesDragging = false;
      dragDistance = 0;
      startX = e.pageX - container.offsetLeft;
      scrollLeftStart = container.scrollLeft;
      container.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX);
      dragDistance = Math.abs(walk);

      if (dragDistance > 5) {
        isStoriesDragging = true;
      }

      container.scrollLeft = scrollLeftStart - walk;
    });

    const stopDrag = () => {
      if (!isDown) return;
      isDown = false;
      container.classList.remove("is-dragging");
      setTimeout(() => {
        isStoriesDragging = false;
      }, 60);
    };

    window.addEventListener("mouseup", stopDrag);
    container.addEventListener("mouseleave", stopDrag);

    // Capture-phase click interceptor on container
    container.addEventListener("click", (e) => {
      if (isStoriesDragging) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    // Mouse wheel horizontal scroll support
    container.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  /* ── 4. Screen Switching (Layer 1 <-> Layer 2) ─────────────── */
  function showLayerHome() {
    const layerHome = $("#layerHome");
    const layerGallery = $("#layerGallery");
    if (layerGallery) layerGallery.classList.add("hidden");
    if (layerHome) layerHome.classList.remove("hidden");
    requestAnimationFrame(() => updatePhoneBorder());
  }

  function showLayerGallery(categoryId, targetArtworkId) {
    const layerHome = $("#layerHome");
    const layerGallery = $("#layerGallery");
    if (layerHome) layerHome.classList.add("hidden");
    if (layerGallery) layerGallery.classList.remove("hidden");

    // Apply category filter
    const catToSet = categoryId || "all";
    filterByCategory(catToSet);

    // If specific target artwork is requested, jump to it
    if (targetArtworkId) {
      const idx = filteredArtworks.findIndex(a => a.id === targetArtworkId);
      if (idx !== -1) {
        currentArtworkIndex = idx;
        renderCarousel();
      }
    }
  }

  /* ── 5. Layer 2: Gallery Carousel & Category Tabs ─────────── */
  function initGallery() {
    renderCategoryTabs();
    renderCarousel();

    // Back to Home button
    const backBtn = $("#backToHomeBtn");
    if (backBtn) {
      backBtn.addEventListener("click", showLayerHome);
    }

    // Magnifier Overview button
    const magBtn = $("#magnifierBtn");
    if (magBtn) {
      magBtn.addEventListener("click", () => {
        openCategoryGrid(activeCategory);
      });
    }

    // Next / Prev buttons
    const prevBtn = $("#prevBtn");
    const nextBtn = $("#nextBtn");
    if (prevBtn) prevBtn.addEventListener("click", () => navigateCarousel(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => navigateCarousel(1));
  }

  function getAvailableCategories() {
    return [
      { id: "all", label: "ALL" },
      ...D.storyItems
        .filter(s => s.type === "category")
        .map(s => ({ id: s.categoryId, label: s.tabLabel || s.label.toUpperCase() }))
    ];
  }

  function renderCategoryTabs() {
    const tabs = $("#categoryTabs");
    if (!tabs) return;
    tabs.innerHTML = "";

    const cats = getAvailableCategories();

    cats.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "px-3.5 py-1 text-[11px] font-medium tracking-widest uppercase whitespace-nowrap rounded transition-all " +
        (cat.id === activeCategory
          ? "bg-white text-neutral-900 shadow-md scale-105"
          : "bg-black/40 hover:bg-black/60 text-white/80 hover:text-white border border-white/20");
      btn.textContent = cat.label;
      btn.addEventListener("click", () => filterByCategory(cat.id));
      tabs.appendChild(btn);
    });
  }

  function shuffleArray(arr) {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function filterByCategory(catId) {
    activeCategory = catId;

    if (catId === "all") {
      const featImg = D.featuredArtwork ? D.featuredArtwork.image : null;
      const featWork = D.artworks.find(a => a.image === featImg);
      const others = D.artworks.filter(a => a !== featWork);
      filteredArtworks = featWork ? [featWork, ...shuffleArray(others)] : shuffleArray(D.artworks);
    } else {
      // Find the cover artwork specified in storyItems
      const catItem = D.storyItems.find(s => s.categoryId === catId);
      const coverImage = catItem ? catItem.image : null;
      const works = D.artworks.filter(a => a.categoryId === catId);
      const coverWork = works.find(w => w.image === coverImage);
      const otherWorks = works.filter(w => w !== coverWork);

      // Representative cover picture placed first, others randomized
      filteredArtworks = coverWork ? [coverWork, ...shuffleArray(otherWorks)] : shuffleArray(works);
    }

    currentArtworkIndex = 0;
    renderCategoryTabs();
    renderCarousel();
  }

  function renderCarousel() {
    const container = $("#carouselContainer");
    if (!container || filteredArtworks.length === 0) return;

    const idx = currentArtworkIndex;
    const total = filteredArtworks.length;

    // Wrap-around index for cyclic 3-piece layout
    const prevIdx = (idx - 1 + total) % total;
    const nextIdx = (idx + 1) % total;

    const prevWork = total > 1 ? filteredArtworks[prevIdx] : null;
    const currWork = filteredArtworks[idx];
    const nextWork = total > 1 ? filteredArtworks[nextIdx] : null;

    container.innerHTML = "";

    // ── (A-1) Left Artwork Card (with white dot filter) ──
    if (prevWork) {
      const sideLeft = buildArtworkCard(prevWork, true);
      sideLeft.className += " hidden md:flex w-[22%] max-w-[240px] opacity-60 hover:opacity-80 cursor-pointer shrink-0";
      sideLeft.addEventListener("click", () => navigateCarousel(-1));
      container.appendChild(sideLeft);
    }

    // ── (A) Central Active Artwork Card (Pure color, no dot filter) ──
    const mainCard = buildArtworkCard(currWork, false);
    mainCard.className += " flex-1 max-w-[85vw] md:max-w-[480px] cursor-pointer shrink-0";
    mainCard.addEventListener("click", () => openArtworkDetail(currWork));
    container.appendChild(mainCard);

    // ── (A+1) Right Artwork Card (with white dot filter) ──
    if (nextWork) {
      const sideRight = buildArtworkCard(nextWork, true);
      sideRight.className += " hidden md:flex w-[22%] max-w-[240px] opacity-60 hover:opacity-80 cursor-pointer shrink-0";
      sideRight.addEventListener("click", () => navigateCarousel(1));
      container.appendChild(sideRight);
    }

    // Counter
    const counter = $("#carouselCounter");
    if (counter) {
      counter.textContent = `${idx + 1} / ${total}`;
    }
  }

  function buildArtworkCard(artwork, isSide) {
    const card = document.createElement("div");
    card.className = "flex flex-col items-center gap-2.5 transition-all duration-300";

    const imgWrap = document.createElement("div");
    imgWrap.className = "relative rounded-lg overflow-hidden " +
      (isSide ? "white-dot-filter shadow-md" : "floating-artwork-shadow");

    const img = safeImg(artwork.image, artwork.title,
      "w-full h-auto max-h-[52vh] object-contain block");
    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    // Title label for main artwork
    if (!isSide) {
      const title = document.createElement("p");
      title.className = "text-xs tracking-[.22em] uppercase text-white/90 font-medium text-center select-none truncate max-w-full px-2";
      title.textContent = artwork.title;
      card.appendChild(title);
    }

    return card;
  }

  function navigateCarousel(dir) {
    const total = filteredArtworks.length;
    if (total <= 1) return;

    // Cross-category circular step
    currentArtworkIndex = (currentArtworkIndex + dir + total) % total;
    renderCarousel();
  }

  /* ── 6. Artwork Detail Modal ─────────────────────────────── */
  function openArtworkDetail(artwork) {
    const modal = $("#artworkModal");
    if (!modal) return;
    const img  = $("#modalArtworkImg");
    const info = $("#modalArtworkInfo");

    if (img) {
      img.src = artwork.image;
      img.draggable = false;
      img.setAttribute("oncontextmenu", "return false;");
    }
    if (info) {
      info.innerHTML = `
        <h2 class="text-lg font-bold tracking-widest uppercase text-neutral-900">${artwork.title}</h2>
        <p class="text-xs text-neutral-500 tracking-wider mt-1">${artwork.year || "2026"} · ${artwork.medium || "Digital"}</p>
        <p class="text-sm text-neutral-600 mt-3 leading-relaxed">${artwork.desc || ""}</p>
      `;
    }
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeArtworkModal() {
    const modal = $("#artworkModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  /* ── 7. About Modal ──────────────────────────────────────── */
  function openAboutModal() {
    const modal = $("#aboutModal");
    if (!modal) return;

    const avatar  = $("#aboutAvatar");
    const name    = $("#aboutName");
    const role    = $("#aboutRole");
    const bio     = $("#aboutBio");
    const email   = $("#aboutEmail");
    const socials = $("#aboutSocials");

    if (avatar)  { avatar.src = D.artist.avatar; avatar.draggable = false; }
    if (name)    name.textContent  = D.artist.displayName;
    if (role)    role.textContent  = D.artist.role;
    if (bio)     bio.textContent   = D.artist.bio;
    if (email)   email.textContent = D.artist.email;
    if (socials) {
      socials.innerHTML = "";
      D.artist.socials.forEach(s => {
        const a = document.createElement("a");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "text-xs tracking-wider text-neutral-500 hover:text-neutral-900 underline";
        a.textContent = s.label;
        socials.appendChild(a);
      });
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeAboutModal() {
    const modal = $("#aboutModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  /* ── 8. Category Grid Overview Modal (Magnifier) ─────────── */
  function openCategoryGrid(categoryId) {
    const modal = $("#categoryGridModal");
    if (!modal) return;
    const grid = $("#categoryGrid");
    const title = $("#categoryGridTitle");
    if (!grid) return;

    const works = (categoryId === activeCategory && filteredArtworks.length > 0)
      ? filteredArtworks
      : ((categoryId === "all") ? D.artworks : D.artworks.filter(a => a.categoryId === categoryId));

    if (title) {
      const catObj = D.storyItems.find(s => s.categoryId === categoryId);
      title.textContent = (catObj ? (catObj.tabLabel || catObj.label) : "ALL") + " OVERVIEW (" + works.length + ")";
    }

    grid.innerHTML = "";

    works.forEach(w => {
      const card = document.createElement("div");
      card.className = "cursor-pointer overflow-hidden rounded group relative bg-neutral-100 aspect-square";
      const img = safeImg(w.image, w.title,
        "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300");
      card.appendChild(img);

      const overlay = document.createElement("div");
      overlay.className = "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2";
      const txt = document.createElement("span");
      txt.className = "text-[10px] text-white tracking-wider truncate uppercase font-medium";
      txt.textContent = w.title;
      overlay.appendChild(txt);
      card.appendChild(overlay);

      card.addEventListener("click", () => {
        closeCategoryGrid();
        const targetIdx = filteredArtworks.findIndex(a => a.id === w.id);
        if (targetIdx !== -1) {
          currentArtworkIndex = targetIdx;
          renderCarousel();
        } else {
          openArtworkDetail(w);
        }
      });
      grid.appendChild(card);
    });

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeCategoryGrid() {
    const modal = $("#categoryGridModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  /* ── 9. Touch-Swipe & Keyboard Navigation ────────────────── */
  function initGesturesAndShortcuts() {
    const container = $("#carouselContainer");
    if (container) {
      let startX = 0;
      container.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      container.addEventListener("touchend", e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) navigateCarousel(diff > 0 ? 1 : -1);
      }, { passive: true });
    }

    document.addEventListener("keydown", e => {
      const anyModalOpen = !$("#artworkModal").classList.contains("hidden") ||
                           !$("#aboutModal").classList.contains("hidden") ||
                           !$("#categoryGridModal").classList.contains("hidden");

      if (e.key === "Escape") {
        if (anyModalOpen) {
          closeArtworkModal();
          closeAboutModal();
          closeCategoryGrid();
        } else {
          const layerGallery = $("#layerGallery");
          if (layerGallery && !layerGallery.classList.contains("hidden")) {
            showLayerHome();
          }
        }
      }

      if (!anyModalOpen) {
        if (e.key === "ArrowRight") navigateCarousel(1);
        if (e.key === "ArrowLeft")  navigateCarousel(-1);
      }
    });
  }

  /* ── 10. Global Anti-Piracy ──────────────────────────────── */
  function initAntiPiracy() {
    document.addEventListener("contextmenu", e => {
      if (e.target.tagName === "IMG") e.preventDefault();
    });
    document.addEventListener("dragstart", e => {
      if (e.target.tagName === "IMG") e.preventDefault();
    });
  }

  /* ── 11. Modal Backdrop & Close Buttons ──────────────────── */
  function initModalBindings() {
    $$("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        closeArtworkModal();
        closeAboutModal();
        closeCategoryGrid();
      });
    });

    ["artworkModal", "aboutModal", "categoryGridModal"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", e => {
          if (e.target === el) {
            closeArtworkModal();
            closeAboutModal();
            closeCategoryGrid();
          }
        });
      }
    });
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initLoading();
    initHero();
    initStories();
    initGallery();
    initGesturesAndShortcuts();
    initAntiPiracy();
    initModalBindings();
    updatePhoneBorder();
  });
})();
