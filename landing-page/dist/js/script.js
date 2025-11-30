// script.js — GANTI seluruh isi skrip lama dengan ini
document.addEventListener('DOMContentLoaded', () => {
    /* ======= CONFIG ======= */
    const ADMIN_WHATSAPP = "6281227446501"; // ganti nomor admin tanpa '+'
    /* ======================= */
  
    // basic elements (may be null if layout changed)
    const hamburger = document.querySelector(".ri-menu-3-line");
    const menu = document.querySelector(".menu");
  
    // safe attach hamburger
    if (hamburger && menu) {
      hamburger.addEventListener("click", () => menu.classList.toggle("menu-active"));
      window.addEventListener("scroll", () => menu.classList.remove("menu-active"));
    }
  
    /* =====================
       FILTER (kategori)
       ===================== */
    const btnFilterNodes = document.querySelectorAll(".produk-box ul li");
  
    function normalizeText(s = "") { return String(s).trim().toLowerCase(); }
  
    // filter handler: always query images fresh (handles dynamic render)
    function applyFilterByText(btnText) {
      const target = normalizeText(btnText);
      const images = document.querySelectorAll(".produk-list img, .produk-list .produk-item");
      images.forEach(img => {
        // try dataset.filter or data-filter attribute
        const f = normalizeText(img.dataset.filter || img.getAttribute("data-filter") || "");
        if (target === "all produk" || target === "all" || f === target) {
          img.style.display = "";
        } else {
          img.style.display = "none";
        }
      });
    }
  
    if (btnFilterNodes && btnFilterNodes.length) {
      btnFilterNodes.forEach(btn => {
        btn.addEventListener("click", () => {
          // set active class
          btnFilterNodes.forEach(x => x.classList.remove("active"));
          btn.classList.add("active");
  
          // filter
          const btnText = (btn.textContent || "");
          applyFilterByText(btnText);
        });
      });
    }
  
    /* =====================
       LIGHTBOX / MODAL
       ===================== */
    const lightbox = document.getElementById('lightbox');
    const lbBackdrop = document.getElementById('lb-backdrop');
    const lbImage = document.getElementById('lb-image');
    const lbClose = document.getElementById('lb-close');
    const btnPesan = document.getElementById('btn-pesan-sekarang'); // may be null if removed
  
    // guard existence
    function isLightboxReady() {
      return lightbox && lbBackdrop && lbImage && lbClose;
    }
  
    function openLightbox(src, title = '') {
      if (!isLightboxReady()) return;
      lbImage.src = src;
      // store current product title on image element for later use
      lbImage.dataset.currentTitle = title || '';
      lightbox.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  
    function closeLightbox() {
      if (!isLightboxReady()) return;
      lightbox.setAttribute('aria-hidden', 'true');
      setTimeout(() => { if (lbImage) lbImage.src = ''; }, 300);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  
    // attach click to product images (works for existing and future images if re-run)
    function attachProductClicks() {
      // select both <img> and .produk-item if you used that markup
      const nodes = document.querySelectorAll('.produk-list img.clickable, .produk-list .produk-item.clickable');
      nodes.forEach(node => {
        if (node._lbBound) return;
        node._lbBound = true;
  
        node.style.cursor = 'pointer';
        node.addEventListener('click', (e) => {
          // determine src and title
          let src = node.tagName.toLowerCase() === 'img' ? node.src : (node.dataset.image || node.querySelector('img')?.src);
          const title = node.dataset.title || node.alt || (node.dataset.image ? (node.dataset.title || '') : node.src.split('/').pop());
          if (!src) return;
          openLightbox(src, title);
        });
      });
    }
  
    // initial attach
    attachProductClicks();
  
    // close handlers
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      // click outside inner content closes modal (more robust)
      lightbox.addEventListener('click', e => {
        // if clicked exactly the overlay container (not the inner content)
        if (e.target === lightbox || e.target === lbBackdrop) closeLightbox();
      });
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  
    // Pesan Sekarang button: open WA with prefilled message
    if (btnPesan) {
      btnPesan.addEventListener('click', () => {
        const currentTitle = (lbImage && lbImage.dataset.currentTitle) ? lbImage.dataset.currentTitle : 'produk';
        const message = `Min aku mau beli ${currentTitle} dong, ada stoknya gak?`;
        const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
        // optional: closeLightbox();
      });
    }
  
    // expose helpers (useful if you generate images later)
    window.attachProductClicks = attachProductClicks;
    window.applyFilterByText = applyFilterByText;
  });
  
