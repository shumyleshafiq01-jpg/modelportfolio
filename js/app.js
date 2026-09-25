/**
 * Sienna Laurent | Aesthetic Model Portfolio & PR Booking Platform
 * Interactive Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initLenisSmoothScroll();
  initPortfolioGallery();
  initCompCardToggle();
  initBookingEngine();
  initMediaReelPlayer();
  initStatsCounters();
  initMobileNav();
  initScrollSpy();
});

/* ==========================================================================
   1. Custom Cursor with Magnetic Effect
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .portfolio-card, .form-option-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/* ==========================================================================
   2. Smooth Scroll & Parallax (Lenis Integration or Fallback)
   ========================================================================== */
function initLenisSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor links smooth navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -70 });
        }
      });
    });
  }

  // Scroll reveal observer
  const reveals = document.querySelectorAll('.reveal-fade');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   3. Portfolio Gallery & Lightbox Modal
   ========================================================================== */
const portfolioItems = [
  {
    id: 1,
    title: 'Vogue Editorial: Autumn Reverie',
    category: 'editorial',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    client: 'Vogue Scandinavia',
    role: 'Lead Cover Model',
    photographer: 'Elena Rostova',
    year: '2025',
    desc: 'Cinematic haute couture spread exploring organic sculptural textures and dramatic drapery.'
  },
  {
    id: 2,
    title: 'L’Éclat Pure Skin Campaign',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    client: 'YSL Beauty / L’Éclat',
    role: 'Global Beauty Face',
    photographer: 'Marc Delauney',
    year: '2025',
    desc: 'High-definition dewy beauty campaign spotlighting natural radiance and architectural facial symmetry.'
  },
  {
    id: 3,
    title: 'Paris Fashion Week: Le Grand Palais',
    category: 'runway',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    client: 'Jacquemus & Maison Margiela',
    role: 'Runway Opener',
    photographer: 'Gilles Bensimon',
    year: '2024',
    desc: 'Opener look for the Spring/Summer Ready-To-Wear collection in Paris.'
  },
  {
    id: 4,
    title: 'Natural Casting Digitals: Set 01',
    category: 'digitals',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    client: 'Agency Digitals / IMG Models',
    role: 'Unretouched Casting Standard',
    photographer: 'Studio Natural Light',
    year: '2025',
    desc: 'Clean, unedited casting polaroids in standard daylight for top-tier international agency roster updates.'
  },
  {
    id: 5,
    title: 'Harper’s Bazaar: Monolithic Silhouettes',
    category: 'editorial',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    client: 'Harper’s Bazaar UK',
    role: 'Editorial Feature',
    photographer: 'Julian Vance',
    year: '2025',
    desc: 'Minimalist high-contrast fashion series focusing on structured outerwear and monochromatic palettes.'
  },
  {
    id: 6,
    title: 'Dyson Hair × Glossier Co-Lab Campaign',
    category: 'collabs',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    client: 'Dyson Beauty / Glossier',
    role: 'Key Influencer & Creator',
    photographer: 'Wylde Flower Productions',
    year: '2025',
    desc: 'Multi-platform social campaign generating 4.2M+ organic views with integrated UGC and reel whitelisting.'
  },
  {
    id: 7,
    title: 'Noir Velvet Cosmetics',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80',
    client: 'Chanel Les Beiges',
    role: 'Global Muse',
    photographer: 'Camille Laurent',
    year: '2024',
    desc: 'Subtle nude aesthetic commercial campaign for global cosmetics launch.'
  },
  {
    id: 8,
    title: 'Milan FW Lookbook & Runway Reel',
    category: 'runway',
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=600&q=80',
    client: 'Prada & Bottega Veneta',
    role: 'Runway Model',
    photographer: 'Milan Backstage Press',
    year: '2025',
    desc: 'Backstage and runway capture from Milan Fashion Week autumn collections.'
  },
  {
    id: 9,
    title: 'Revolve Festival Exclusive Creator Showcase',
    category: 'collabs',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    client: 'Revolve Group',
    role: 'VIP Brand Ambassador',
    photographer: 'Street Style Collective',
    year: '2025',
    desc: 'High-impact festival lifestyle lookbook and sponsored Instagram story takeover.'
  }
];

let currentLightboxIndex = 0;
let filteredItems = [...portfolioItems];

function initPortfolioGallery() {
  const galleryGrid = document.getElementById('portfolio-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (!galleryGrid) return;

  function renderGallery(items) {
    galleryGrid.innerHTML = items.map((item, index) => `
      <div class="portfolio-card relative overflow-hidden group aspect-[3/4] reveal-fade visible cursor-pointer" data-id="${item.id}" data-index="${index}">
        <img src="${item.image}" alt="${item.title}" class="portfolio-img w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy">
        <div class="portfolio-overlay absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/90 via-[#0a0a0b]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 p-6 flex flex-col justify-end">
          <span class="text-xs uppercase tracking-[0.2em] text-[#c5a880] font-mono mb-1">${item.category} • ${item.year}</span>
          <h3 class="font-serif text-xl md:text-2xl text-white font-medium mb-1">${item.title}</h3>
          <p class="text-xs text-gray-300 line-clamp-1">${item.client} — ${item.role}</p>
          <div class="mt-3 flex items-center gap-2 text-xs text-[#c5a880] uppercase tracking-wider font-semibold">
            <span>View Editorial Case</span>
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click for lightbox
    document.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'));
        const index = filteredItems.findIndex(i => i.id === id);
        openLightbox(index >= 0 ? index : 0);
      });
    });
  }

  renderGallery(filteredItems);

  // Tab Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        filteredItems = [...portfolioItems];
      } else {
        filteredItems = portfolioItems.filter(item => item.category === filter);
      }
      renderGallery(filteredItems);
    });
  });

  // Lightbox Modal Controls
  const lightbox = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (lightbox) {
    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => navigateLightbox(-1));
    nextBtn?.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const item = filteredItems[currentLightboxIndex];
  if (!item) return;

  const lightbox = document.getElementById('lightbox-modal');
  const lbImage = document.getElementById('lightbox-image');
  const lbTitle = document.getElementById('lightbox-title');
  const lbCategory = document.getElementById('lightbox-category');
  const lbClient = document.getElementById('lightbox-client');
  const lbRole = document.getElementById('lightbox-role');
  const lbPhotographer = document.getElementById('lightbox-photographer');
  const lbYear = document.getElementById('lightbox-year');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbCounter = document.getElementById('lightbox-counter');

  if (lbImage) lbImage.src = item.image;
  if (lbTitle) lbTitle.textContent = item.title;
  if (lbCategory) lbCategory.textContent = item.category.toUpperCase();
  if (lbClient) lbClient.textContent = item.client;
  if (lbRole) lbRole.textContent = item.role;
  if (lbPhotographer) lbPhotographer.textContent = item.photographer;
  if (lbYear) lbYear.textContent = item.year;
  if (lbDesc) lbDesc.textContent = item.desc;
  if (lbCounter) lbCounter.textContent = `${currentLightboxIndex + 1} / ${filteredItems.length}`;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = filteredItems.length - 1;
  if (currentLightboxIndex >= filteredItems.length) currentLightboxIndex = 0;
  openLightbox(currentLightboxIndex);
}

/* ==========================================================================
   4. Interactive Comp Card / Zed Card Engine
   ========================================================================== */
function initCompCardToggle() {
  const unitToggle = document.getElementById('unit-toggle-btn');
  const printBtn = document.getElementById('print-comp-card-btn');
  const flipBtn = document.getElementById('flip-comp-card-btn');
  const cardElement = document.getElementById('comp-card-inner');

  let isMetric = false;

  const measurements = {
    height: { imperial: "5'10\"", metric: "178 cm" },
    bust: { imperial: "32\"", metric: "81 cm" },
    waist: { imperial: "24\"", metric: "61 cm" },
    hips: { imperial: "34.5\"", metric: "88 cm" },
    shoes: { imperial: "8.5 US", metric: "39 EU" },
    dress: { imperial: "2-4 US", metric: "34-36 EU" },
  };

  if (unitToggle) {
    unitToggle.addEventListener('click', () => {
      isMetric = !isMetric;
      unitToggle.textContent = isMetric ? "Switch to Imperial (Inches)" : "Switch to Metric (CM / EU)";
      
      const elHeight = document.getElementById('stat-height');
      const elBust = document.getElementById('stat-bust');
      const elWaist = document.getElementById('stat-waist');
      const elHips = document.getElementById('stat-hips');
      const elShoes = document.getElementById('stat-shoes');
      const elDress = document.getElementById('stat-dress');

      const mode = isMetric ? 'metric' : 'imperial';
      if (elHeight) elHeight.textContent = measurements.height[mode];
      if (elBust) elBust.textContent = measurements.bust[mode];
      if (elWaist) elWaist.textContent = measurements.waist[mode];
      if (elHips) elHips.textContent = measurements.hips[mode];
      if (elShoes) elShoes.textContent = measurements.shoes[mode];
      if (elDress) elDress.textContent = measurements.dress[mode];
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (flipBtn && cardElement) {
    flipBtn.addEventListener('click', () => {
      cardElement.classList.toggle('flipped');
    });
  }
}

/* ==========================================================================
   5. Interactive PR & Collab Booking Engine
   ========================================================================== */
function initBookingEngine() {
  const steps = [
    document.getElementById('booking-step-1'),
    document.getElementById('booking-step-2'),
    document.getElementById('booking-step-3'),
    document.getElementById('booking-step-4')
  ];

  const stepDots = [
    document.getElementById('step-dot-1'),
    document.getElementById('step-dot-2'),
    document.getElementById('step-dot-3'),
    document.getElementById('step-dot-4')
  ];

  let currentStep = 0;

  // Booking State Object
  const bookingData = {
    collabType: 'Editorial & Fashion Campaign',
    deliverables: ['Instagram Reel / TikTok', 'Whitelisting Rights (30 Days)'],
    location: 'New York / Global On-Site',
    budgetTier: '$7,500 – $15,000 (Tier 1)',
    brandName: '',
    contactEmail: '',
    projectDates: '',
    notes: ''
  };

  function updateStepsUI() {
    steps.forEach((step, idx) => {
      if (step) {
        if (idx === currentStep) {
          step.classList.remove('hidden');
          step.classList.add('block');
        } else {
          step.classList.add('hidden');
          step.classList.remove('block');
        }
      }
    });

    stepDots.forEach((dot, idx) => {
      if (dot) {
        if (idx === currentStep) {
          dot.className = 'step-dot active';
        } else if (idx < currentStep) {
          dot.className = 'step-dot completed';
        } else {
          dot.className = 'step-dot';
        }
      }
    });

    updateSummary();
  }

  function updateSummary() {
    const summaryType = document.getElementById('summary-collab-type');
    const summaryDeliverables = document.getElementById('summary-deliverables');
    const summaryBudget = document.getElementById('summary-budget');
    const summaryEstimatedFee = document.getElementById('summary-estimated-fee');

    if (summaryType) summaryType.textContent = bookingData.collabType;
    if (summaryDeliverables) summaryDeliverables.textContent = bookingData.deliverables.join(' + ') || 'Standard Deliverables';
    if (summaryBudget) summaryBudget.textContent = bookingData.budgetTier;

    // Calculate approximate quote guide
    let base = 5000;
    if (bookingData.collabType.includes('Campaign')) base = 8500;
    if (bookingData.collabType.includes('Ambassador')) base = 25000;
    if (bookingData.collabType.includes('Runway')) base = 6000;
    if (bookingData.collabType.includes('Gifting')) base = 1500;

    const addOnMultiplier = bookingData.deliverables.length * 1200;
    const finalEst = base + addOnMultiplier;

    if (summaryEstimatedFee) {
      summaryEstimatedFee.textContent = `$${finalEst.toLocaleString()} – $${(finalEst * 1.35).toLocaleString()}`;
    }
  }

  // Step 1: Select Type
  document.querySelectorAll('.collab-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.collab-type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingData.collabType = card.getAttribute('data-value') || card.querySelector('h4').textContent.trim();
      updateSummary();
    });
  });

  // Step 2: Select Deliverables & Add-ons
  document.querySelectorAll('.deliverable-checkbox').forEach(box => {
    box.addEventListener('change', () => {
      const selected = [];
      document.querySelectorAll('.deliverable-checkbox:checked').forEach(checked => {
        selected.push(checked.value);
      });
      bookingData.deliverables = selected;
      updateSummary();
    });
  });

  // Navigation Buttons
  document.getElementById('next-step-1')?.addEventListener('click', () => {
    currentStep = 1;
    updateStepsUI();
  });

  document.getElementById('prev-step-2')?.addEventListener('click', () => {
    currentStep = 0;
    updateStepsUI();
  });

  document.getElementById('next-step-2')?.addEventListener('click', () => {
    currentStep = 2;
    updateStepsUI();
  });

  document.getElementById('prev-step-3')?.addEventListener('click', () => {
    currentStep = 1;
    updateStepsUI();
  });

  document.getElementById('next-step-3')?.addEventListener('click', () => {
    // Collect Inputs
    const brandInput = document.getElementById('input-brand-name');
    const emailInput = document.getElementById('input-email');
    const dateInput = document.getElementById('input-target-date');
    const budgetSelect = document.getElementById('select-budget-tier');

    if (brandInput && !brandInput.value.trim()) {
      brandInput.focus();
      brandInput.classList.add('border-red-500');
      return;
    }
    if (emailInput && !emailInput.value.trim()) {
      emailInput.focus();
      emailInput.classList.add('border-red-500');
      return;
    }

    bookingData.brandName = brandInput ? brandInput.value : '';
    bookingData.contactEmail = emailInput ? emailInput.value : '';
    bookingData.projectDates = dateInput ? dateInput.value : '';
    bookingData.budgetTier = budgetSelect ? budgetSelect.value : '$5,000 – $10,000';

    currentStep = 3;
    updateStepsUI();
  });

  document.getElementById('prev-step-4')?.addEventListener('click', () => {
    currentStep = 2;
    updateStepsUI();
  });

  // Final Submit Action
  document.getElementById('submit-booking-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-booking-btn');
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Submitting Inquiry to Representation...
    `;

    setTimeout(() => {
      const step4Container = document.getElementById('booking-step-4');
      if (step4Container) {
        step4Container.innerHTML = `
          <div class="text-center py-12 px-6">
            <div class="w-16 h-16 bg-[#c5a880]/20 text-[#c5a880] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#c5a880]/40">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 class="font-serif text-3xl text-white mb-2">Collaboration Inquiry Received</h3>
            <p class="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Thank you for reaching out, <span class="text-white font-medium">${bookingData.brandName || 'Partner'}</span>. Sienna Laurent's booking agent & PR team have received your details and will respond within 24 business hours with availability and formal call sheet/contract terms.
            </p>
            <div class="bg-[#121215] p-4 rounded-lg max-w-md mx-auto text-left border border-white/10 text-xs space-y-2 text-gray-300">
              <div class="flex justify-between"><span class="text-gray-500">Inquiry ID:</span> <span class="font-mono text-[#c5a880]">SL-PR-${Math.floor(100000 + Math.random() * 900000)}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Confirmation Sent To:</span> <span>${bookingData.contactEmail || 'agency@partner.com'}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Direct Agency Rep:</span> <span>IMG Models NY / PR Team</span></div>
            </div>
            <button onclick="location.reload()" class="btn-outline mt-8 text-xs">Submit Another Inquiry</button>
          </div>
        `;
      }
    }, 1200);
  });
}

/* ==========================================================================
   6. Ambient Video & Audio Reel Controls
   ========================================================================== */
function initMediaReelPlayer() {
  const audioBtn = document.getElementById('ambient-sound-toggle');
  let isMuted = true;

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      audioBtn.innerHTML = isMuted ? `
        <svg class="w-4 h-4 text-[#c5a880]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" stroke-dasharray="2 2"/></svg>
        <span class="text-xs uppercase tracking-widest text-gray-400">Ambient Sound: Off</span>
      ` : `
        <svg class="w-4 h-4 text-[#c5a880]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
        <span class="text-xs uppercase tracking-widest text-[#c5a880]">Ambient Sound: On</span>
      `;
    });
  }
}

/* ==========================================================================
   7. Animated Stats Counters
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 2000;
          const increment = target / (duration / 16);

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + suffix;
            }
          };
          updateCounter();
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('media-kit');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });

    closeBtn?.addEventListener('click', () => {
      drawer.classList.add('translate-x-full');
      document.body.style.overflow = '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================================================
   9. Active Navigation Scroll Spy
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-[#c5a880]');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-[#c5a880]');
      }
    });
  });
}
