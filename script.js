// script.js
/*=========================
Header and Footer
==========================*/

  document.addEventListener("DOMContentLoaded", () => {
    fetch("header.html").then(r => r.text()).then(html => {
      document.getElementById("header-container").innerHTML = html;
    });
  });

/* =========================
   Mobile Header / Navigation
   ========================= */
   function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('show');
  
    if (nav.classList.contains('show')) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScrollClose);
    }
  }
  function handleClickOutside(event) {
    const nav = document.getElementById('navMenu');
    const toggleBtn = document.querySelector('.hamburger');
    if (!nav.contains(event.target) && !toggleBtn.contains(event.target)) {
      nav.classList.remove('show');
      cleanupListeners();
    }
  }
  function handleScrollClose() {
    const nav = document.getElementById('navMenu');
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      cleanupListeners();
    }
  }
  function cleanupListeners() {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('scroll', handleScrollClose);
  }
  
  /* =========================
     Footer (optional mount if you have footer.html)
     ========================= */
  fetch("footer.html")
    .then(res => res.ok ? res.text() : "")
    .then(html => {
      if (html) document.getElementById("footer-container").innerHTML = html;
    })
    .catch(()=>{});
  
  /* =========================
     Page Init / Modals / Tabs
     ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    // === ORDER BUTTONS OPEN CONTACT MODAL ===
    const contactModal = document.getElementById("contact-modal");
    const contactSelect = document.getElementById("package");
    const orderButtons = document.querySelectorAll(".order-button");
  
    orderButtons.forEach(button => {
      button.addEventListener("click", () => {
        const selectedPackage = button.getAttribute("data-package");
        if (contactSelect && selectedPackage) contactSelect.value = selectedPackage;
        if (contactModal) {
          contactModal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        }
      });
    });
  
    // === PACKAGE TABS ===
    document.querySelectorAll(".package-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".package-tab").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".package-content").forEach(content => content.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.target).classList.add("active");
      });
    });
  
    // === CONTACT MODAL CLOSE ===
    if (contactModal) {
      contactModal.addEventListener("click", (e) => {
        if (e.target === contactModal) {
          contactModal.classList.add("hidden");
          document.body.style.overflow = "auto";
        }
      });
      const contactCloseBtn = contactModal.querySelector(".close-button");
      if (contactCloseBtn) {
        contactCloseBtn.addEventListener("click", () => {
          contactModal.classList.add("hidden");
          document.body.style.overflow = "auto";
        });
      }
    }
  
    // === REVIEW MODAL ===
    const reviewForm = document.getElementById("submitReview");
    const reviewList = document.querySelector(".review-list");
    const reviewModal = document.getElementById("review-modal");
    const openReviewModal = document.getElementById("openReviewModal");
    const closeReviewModal = reviewModal?.querySelector(".close-button");
  
    if (openReviewModal && closeReviewModal && reviewModal) {
      openReviewModal.addEventListener("click", () => {
        reviewModal.classList.remove("hidden");
      });
  
      closeReviewModal.addEventListener("click", () => {
        reviewModal.classList.add("hidden");
      });
  
      window.addEventListener("click", (e) => {
        if (e.target === reviewModal) {
          reviewModal.classList.add("hidden");
        }
      });
    }
  
    // === BACK TO TOP ===
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
      window.addEventListener("scroll", () => {
        backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
      }, { passive: true });
      backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  });
  
  /* =========================
     Our UI / Figma Designs — Gallery & Lightbox
     ========================= */
  (function(){
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
  
    const items = Array.from(grid.querySelectorAll('.item'));
  
    /* -------------------- THUMB HOVER AUTO-PAN (mouse ONLY) -------------------- */
    const hoverAnimations = new WeakMap();
  
    function startPan(img){
      const thumb = img.closest('.thumb');
      if (!thumb || !img.complete) return;
  
      const imgRect = img.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const delta = Math.max(0, imgRect.height - thumbRect.height);
      if (delta <= 0) return;
  
      const duration = Math.max(1000, (delta / 80) * 1000);
      const anim = img.animate(
        [{ transform: 'translateY(0px)' }, { transform: `translateY(-${delta}px)` }],
        { duration, easing: 'linear', fill: 'forwards' }
      );
      hoverAnimations.set(img, anim);
    }
    function stopPan(img){
      const anim = hoverAnimations.get(img);
      if (anim){ anim.cancel(); hoverAnimations.delete(img); }
      img.style.transform = 'translateY(0)';
    }
    items.forEach(fig=>{
      const img = fig.querySelector('.thumb img');
      fig.addEventListener('pointerenter', (e)=>{ if (e.pointerType === 'mouse') startPan(img); });
      fig.addEventListener('pointerleave', ()=> stopPan(img));
    });
  
    /* -------------------- LIGHTBOX -------------------- */
    const lb = document.getElementById('ui-lightbox');
    const stage = lb?.querySelector('.lb-stage');
    const lbImg = lb?.querySelector('.lb-img');
    const btnClose = lb?.querySelector('.lb-close');
    const btnPrev = lb?.querySelector('.lb-prev');
    const btnNext = lb?.querySelector('.lb-next');
  
    if (!lb || !stage || !lbImg) return;
  
    let currentIndex = 0;
    let zoomed = false;
    let dragActive = false;
    let translateY = 0;
    let startY = 0;
  
    function setBodyScroll(disable){
      document.documentElement.style.overflow = disable ? 'hidden' : '';
      document.body.style.overflow = disable ? 'hidden' : '';
    }
  
    function openAt(index){
      currentIndex = index;
      const visible = items.filter(el => el.style.display !== 'none');
      const fig = visible[currentIndex] || items[index];
      const src = fig.dataset.full || fig.querySelector('img').getAttribute('src');
  
      lb.classList.add('open');
      setBodyScroll(true);
      stage.classList.remove('ready');
      stage.classList.add('loading');
      lbImg.src = '';
      zoomed = false;
      translateY = 0;
      lb.classList.remove('zoomed');
      lbImg.style.transform = 'translate(-50%, -50%) scale(1)';
  
      const tmp = new Image();
      tmp.onload = ()=>{
        lbImg.src = src;
        requestAnimationFrame(()=>{
          stage.classList.remove('loading');
          stage.classList.add('ready');
        });
      };
      tmp.src = src;
    }
    function close(){ lb.classList.remove('open'); setBodyScroll(false); }
  
    function next(){
      const visible = items.filter(el => el.style.display !== 'none');
      if (!visible.length) return;
      currentIndex = (currentIndex + 1) % visible.length;
      openAt(currentIndex);
    }
    function prev(){
      const visible = items.filter(el => el.style.display !== 'none');
      if (!visible.length) return;
      currentIndex = (currentIndex - 1 + visible.length) % visible.length;
      openAt(currentIndex);
    }
  
    // Open lightbox
    items.forEach((fig, idx)=>{
      fig.addEventListener('click', ()=>{
        const visible = items.filter(el => el.style.display !== 'none');
        const visibleIndex = visible.indexOf(fig);
        openAt(visibleIndex >= 0 ? visibleIndex : idx);
      });
      fig.addEventListener('keydown', (e)=>{
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault(); fig.click();
        }
      });
    });
  
    btnClose?.addEventListener('click', close);
    btnNext?.addEventListener('click', next);
    btnPrev?.addEventListener('click', prev);
  
    // Click outside stage closes
    lb.addEventListener('click', (e)=>{ if (e.target === lb) close(); });
  
    // Keyboard
    window.addEventListener('keydown', (e)=>{
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  
    // Click to toggle zoom
    lbImg.addEventListener('click', (e)=>{
      e.stopPropagation();
      zoomed = !zoomed;
      translateY = 0;
      if (zoomed){
        lb.classList.add('zoomed');
        lbImg.style.transform = 'translate(-50%, -50%) scale(2.2)';
      }else{
        lb.classList.remove('zoomed');
        lbImg.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
  
    // Clamp vertical pan
    function clampPan(){
      const stageH = stage.clientHeight;
      const imgH = lbImg.naturalHeight;
      const imgW = lbImg.naturalWidth;
      const scale = zoomed ? 2.2 : 1;
      const renderedH = Math.min(stageH, (stage.clientWidth * imgH) / imgW) * scale;
      const maxOverflow = Math.max(0, (renderedH - stageH) / 2);
      const minY = -maxOverflow;
      const maxY =  maxOverflow;
      if (translateY < minY) translateY = minY;
      if (translateY > maxY) translateY = maxY;
      lbImg.style.transform = `translate(calc(-50%), calc(-50% + ${translateY}px)) scale(${scale})`;
    }
  
    // Wheel/trackpad: scroll image vertically when zoomed
    stage.addEventListener('wheel', (e)=>{
      if (!zoomed) return;
      e.preventDefault();
      translateY -= e.deltaY * 0.75;
      clampPan();
    }, { passive: false });
  
    // Drag to pan (mouse/touch)
    function onDown(e){
      if (!zoomed) return;
      dragActive = true;
      startY = (e.touches ? e.touches[0].clientY : e.clientY) - translateY;
      lbImg.style.cursor = 'grabbing';
    }
    function onMove(e){
      if (!dragActive) return;
      const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
      translateY = clientY - startY;
      clampPan();
    }
    function onUp(){
      dragActive = false;
      lbImg.style.cursor = zoomed ? 'grab' : 'zoom-in';
    }
    lbImg.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    lbImg.addEventListener('touchstart', onDown, {passive:true});
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('touchend', onUp);
  })();
  
  /* =========================
     Business-Professional FX
     ========================= */
  (function(){
    // Header depth + progress bar
    const header = document.querySelector('header');
    const progress = document.getElementById('progressbar');
  
    function onScroll(){
      const y = window.scrollY || document.documentElement.scrollTop;
      header && header.classList.toggle('scrolled', y > 8);
  
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const pct = Math.min(100, (y / max) * 100);
      if (progress) progress.style.width = pct + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  
    // Scroll reveal via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            if (entry.isIntersecting){
              entry.target.classList.add('show');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
      } else {
        revealEls.forEach(el => el.classList.add('show'));
      }
    }
  })();

/* =========================
   Scroll Shift FX
   ========================= */
(function(){
  try {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const containers = Array.from(document.querySelectorAll(
      'section:not([data-no-shift]), .reviews:not([data-no-shift])'
    ));

    if (!containers.length) return;

    const SHIFT_SELECTOR = ['> *'].join(',');
    const allItems = [];

    containers.forEach((section) => {
      section.classList.add('scroll-shift');

      const kids = Array.from(section.querySelectorAll(SHIFT_SELECTOR))
        .filter(el => el.tagName !== 'SCRIPT' && el.id !== 'ui-lightbox' && !el.closest('#ui-lightbox'));

      kids.forEach((el, i) => {
        el.classList.add('shift-item');
        const dir = (i % 2 === 0) ? 1 : -1; // alternate up/down
        const baseAmp = window.innerWidth < 768 ? 28 : 60;
        const jitter = 0.8 + (((i * 137) % 23) / 100); // 0.8 .. ~1.03
        el.__shiftCfg = { dir, amp: baseAmp * jitter, section };
        allItems.push(el);
      });
    });

    let ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    function update(){
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      allItems.forEach(el => {
        const cfg = el.__shiftCfg;
        if (!cfg) return;
        const { dir, amp, section } = cfg;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > vh + 100) return;

        const visibleHeight = Math.max(1, rect.height + vh);
        const progress = (vh - rect.top) / visibleHeight; // ~0..1
        const centered = (progress - 0.5) * 2;            // -1..1
        const offsetY = centered * amp * dir;
        el.style.transform = `translateY(${offsetY.toFixed(2)}px)`;
      });
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth < 768;
      allItems.forEach((el, i) => {
        const jitter = 0.8 + (((i * 137) % 23) / 100);
        if (el.__shiftCfg) el.__shiftCfg.amp = (isMobile ? 28 : 60) * jitter;
      });
      update();
    }, { passive: true });
  } catch (e) {
    console.error('Scroll Shift FX init failed:', e);
  }
})();
