/**
 * DENTAL ATLAS — CLIENT ENGINE & STATE MACHINE
 * Implements:
 * - 3 User Pathways: Services / Doctors / Booking
 * - Branch switching: Ispanskie (Primary) <-> Prokshino (Secondary)
 * - Deep linking & Browser History (popstate, pushState)
 * - Service Navigator & Dynamic Stage rendering
 * - Doctor Directory & Contextual Dossier transitions
 * - Non-disruptive Verified Booking Gateway
 * - Zero unverified assumptions.
 */

(function () {
  'use strict';

  const data = window.ATLAS_DATA;
  if (!data) {
    console.error('ATLAS_DATA not found. Engine stopped.');
    return;
  }

  // State object
  const state = {
    branch: 'ispanskie',
    pathway: 'services', // 'services' | 'doctors' | 'booking'
    catId: 'diagnostics',
    procId: 'consult-head',
    docSlug: null,
    searchQuery: '',
    modalOpen: false,
    modalContext: null
  };

  // DOM Elements
  const el = {
    // Branch switcher
    btnBranchIspanskie: document.getElementById('switchBranchIspanskie'),
    btnBranchProkshino: document.getElementById('switchBranchProkshino'),
    brandBranchBadge: document.getElementById('brandBranchBadge'),
    topPhoneLink: document.getElementById('topPhoneLink'),
    topPhoneText: document.getElementById('topPhoneText'),

    // Pathway Tabs
    pathwayBtns: document.querySelectorAll('[data-pathway]'),
    views: {
      services: document.getElementById('viewServices'),
      doctors: document.getElementById('viewDoctors'),
      booking: document.getElementById('viewBooking')
    },

    // Context Ribbon
    ribbonCrumbs: document.getElementById('ribbonCrumbs'),
    ribbonMeta: document.getElementById('ribbonMeta'),

    // Services View Elements
    navSearchInput: document.getElementById('navSearchInput'),
    categoryList: document.getElementById('categoryList'),
    procedureList: document.getElementById('procedureList'),
    stageMediaImg: document.getElementById('stageMediaImg'),
    stageMediaBadge: document.getElementById('stageMediaBadge'),
    stageProcTitle: document.getElementById('stageProcTitle'),
    stageProcTag: document.getElementById('stageProcTag'),
    stagePriceVal: document.getElementById('stagePriceVal'),
    stageProcDesc: document.getElementById('stageProcDesc'),
    stageDoctorBox: document.getElementById('stageDoctorBox'),
    stageBookBtn: document.getElementById('stageBookBtn'),
    stageShareBtn: document.getElementById('stageShareBtn'),

    // Doctors View Elements
    doctorsGrid: document.getElementById('doctorsGrid'),

    // Booking View Elements
    gatewayAddressText: document.getElementById('gatewayAddressText'),
    gatewayHoursText: document.getElementById('gatewayHoursText'),

    // Modal
    bookingModal: document.getElementById('bookingModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalContextNotice: document.getElementById('modalContextNotice'),
    modalCopyPhoneBtn: document.getElementById('modalCopyPhoneBtn'),
    modalCopyFeedback: document.getElementById('modalCopyFeedback'),

    // Mobile float
    mobileFloatCall: document.getElementById('mobileFloatCall'),
    mobileFloatBook: document.getElementById('mobileFloatBook')
  };

  // 1. URL State Parsing
  function parseUrlState() {
    const params = new URLSearchParams(window.location.search);
    const branchParam = params.get('branch');
    const viewParam = params.get('view');
    const catParam = params.get('cat');
    const idParam = params.get('id');

    if (branchParam && data.branches[branchParam]) {
      state.branch = branchParam;
    } else {
      state.branch = 'ispanskie';
    }

    if (viewParam && ['services', 'doctors', 'booking'].includes(viewParam)) {
      state.pathway = viewParam;
    } else {
      state.pathway = 'services';
    }

    if (catParam && data.categories.some(c => c.id === catParam)) {
      state.catId = catParam;
    } else {
      state.catId = data.categories[0].id;
    }

    if (idParam && data.procedures.some(p => p.id === idParam)) {
      state.procId = idParam;
    } else {
      const firstProcInCat = data.procedures.find(p => p.catId === state.catId);
      state.procId = firstProcInCat ? firstProcInCat.id : data.procedures[0].id;
    }
  }

  // 2. URL State Sync (pushState)
  function syncUrl(replace = false) {
    const params = new URLSearchParams();
    params.set('branch', state.branch);
    params.set('view', state.pathway);
    if (state.pathway === 'services') {
      params.set('cat', state.catId);
      params.set('id', state.procId);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (replace) {
      window.history.replaceState(null, '', newUrl);
    } else {
      window.history.pushState(null, '', newUrl);
    }
  }

  // 3. Render TopBar & Ribbon
  function renderHeaderAndRibbon() {
    const branch = data.branches[state.branch];

    // Branch switch buttons
    if (el.btnBranchIspanskie && el.btnBranchProkshino) {
      el.btnBranchIspanskie.classList.toggle('is-active', state.branch === 'ispanskie');
      el.btnBranchProkshino.classList.toggle('is-active', state.branch === 'prokshino');
    }

    if (el.brandBranchBadge) {
      el.brandBranchBadge.textContent = branch.shortName;
    }

    if (el.topPhoneText) {
      el.topPhoneText.textContent = branch.phone;
    }
    if (el.topPhoneLink) {
      el.topPhoneLink.href = `tel:${branch.phoneClean}`;
    }

    // Pathway Tabs
    el.pathwayBtns.forEach(btn => {
      const active = btn.dataset.pathway === state.pathway;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    // View Containers Visibility
    Object.keys(el.views).forEach(vKey => {
      if (el.views[vKey]) {
        el.views[vKey].classList.toggle('is-visible', vKey === state.pathway);
      }
    });

    // Context Ribbon
    if (el.ribbonCrumbs) {
      let crumbHtml = `<span class="context-crumb-item">${branch.name}</span>`;
      if (state.pathway === 'services') {
        const cat = data.categories.find(c => c.id === state.catId);
        const proc = data.procedures.find(p => p.id === state.procId);
        crumbHtml += ` <span class="context-crumb-divider">/</span> <span class="context-crumb-item">Услуги</span>`;
        if (cat) crumbHtml += ` <span class="context-crumb-divider">/</span> <span class="context-crumb-item">${cat.name}</span>`;
        if (proc) crumbHtml += ` <span class="context-crumb-divider">/</span> <strong class="context-crumb-item is-current">${proc.name}</strong>`;
      } else if (state.pathway === 'doctors') {
        crumbHtml += ` <span class="context-crumb-divider">/</span> <strong class="context-crumb-item is-current">Специалисты клиники</strong>`;
      } else if (state.pathway === 'booking') {
        crumbHtml += ` <span class="context-crumb-divider">/</span> <strong class="context-crumb-item is-current">Шлюз записи на приём</strong>`;
      }
      el.ribbonCrumbs.innerHTML = crumbHtml;
    }

    if (el.ribbonMeta) {
      el.ribbonMeta.textContent = `${branch.address} · ${branch.hours}`;
    }
  }

  // 4. Render Services View (Clinical Canvas)
  function renderServices() {
    // Categories Nav
    if (el.categoryList) {
      el.categoryList.innerHTML = '';
      data.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `nav-cat-btn ${cat.id === state.catId ? 'is-active' : ''}`;
        btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
        btn.addEventListener('click', () => {
          state.catId = cat.id;
          const firstProc = data.procedures.find(p => p.catId === cat.id);
          if (firstProc) state.procId = firstProc.id;
          syncUrl();
          renderHeaderAndRibbon();
          renderServices();
        });
        el.categoryList.appendChild(btn);
      });
    }

    // Filter procedures by category and search
    let filtered = data.procedures.filter(p => p.catId === state.catId);
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = data.procedures.filter(p => p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
    }

    // Procedures list
    if (el.procedureList) {
      el.procedureList.innerHTML = '';
      if (filtered.length === 0) {
        el.procedureList.innerHTML = '<div style="padding: 16px; font-size: 0.8rem; color: var(--wire-ink-muted);">По вашему запросу процедур не найдено. Позвоните в клинику для консультации.</div>';
      } else {
        filtered.forEach(proc => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `nav-proc-btn ${proc.id === state.procId ? 'is-active' : ''}`;
          
          const price = proc.prices[state.branch] || Object.values(proc.prices)[0] || 'По запросу';

          btn.innerHTML = `
            <div class="proc-btn-header">
              <span class="proc-btn-title">${proc.name}</span>
              <span class="proc-btn-price">${price}</span>
            </div>
            <span class="proc-btn-tag">${proc.tag}</span>
          `;

          btn.addEventListener('click', () => {
            state.procId = proc.id;
            syncUrl();
            renderHeaderAndRibbon();
            renderStage();
            // Update active state in list
            el.procedureList.querySelectorAll('.nav-proc-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
          });

          el.procedureList.appendChild(btn);
        });
      }
    }

    renderStage();
  }

  // 5. Render Stage Pane (ServiceScene)
  function renderStage() {
    const proc = data.procedures.find(p => p.id === state.procId) || data.procedures[0];
    if (!proc) return;

    const branch = data.branches[state.branch];
    const price = proc.prices[state.branch] || 'По запросу';
    const imgSrc = (proc.images && proc.images[state.branch]) || branch.heroImage;

    if (el.stageMediaImg) {
      el.stageMediaImg.src = imgSrc;
      el.stageMediaImg.alt = `${proc.name} — ${branch.name}`;
    }
    if (el.stageMediaBadge) {
      el.stageMediaBadge.textContent = `${branch.name} · ${proc.tag}`;
    }
    if (el.stageProcTitle) {
      el.stageProcTitle.textContent = proc.name;
    }
    if (el.stageProcTag) {
      el.stageProcTag.textContent = proc.tag;
    }
    if (el.stagePriceVal) {
      el.stagePriceVal.textContent = price;
    }
    if (el.stageProcDesc) {
      el.stageProcDesc.textContent = proc.desc;
    }

    // Matching Doctor
    if (el.stageDoctorBox) {
      const docSlug = (proc.doctorSlugs && proc.doctorSlugs[0]) || 'danielyan';
      const doc = data.doctors.find(d => d.slug === docSlug);
      if (doc) {
        el.stageDoctorBox.innerHTML = `
          <div class="stage-doc-meta">
            <img src="${doc.portrait}" alt="${doc.name}" class="stage-doc-avatar">
            <div class="stage-doc-info">
              <strong>${doc.name}</strong>
              <small>${doc.role} · Опыт ${doc.experience}</small>
            </div>
          </div>
          <button type="button" class="btn-secondary-wire" id="stageDocProfileBtn">
            Профиль врача →
          </button>
        `;
        const profileBtn = el.stageDoctorBox.querySelector('#stageDocProfileBtn');
        if (profileBtn) {
          profileBtn.addEventListener('click', () => {
            state.pathway = 'doctors';
            state.docSlug = doc.slug;
            syncUrl();
            renderHeaderAndRibbon();
            renderDoctors();
          });
        }
      }
    }

    // Book button action
    if (el.stageBookBtn) {
      el.stageBookBtn.onclick = () => {
        openBookingModal(`Процедура: ${proc.name} (${price})`);
      };
    }

    // Share button
    if (el.stageShareBtn) {
      el.stageShareBtn.onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          el.stageShareBtn.textContent = '✓ Ссылка скопирована';
          setTimeout(() => {
            el.stageShareBtn.textContent = 'Скопировать ссылку';
          }, 2000);
        }
      };
    }
  }

  // 6. Render Doctors Directory
  function renderDoctors() {
    if (!el.doctorsGrid) return;
    el.doctorsGrid.innerHTML = '';

    // Filter doctors affiliated with the current branch
    const branchDoctors = data.doctors.filter(d => d.branches.includes(state.branch));

    branchDoctors.forEach(doc => {
      const card = document.createElement('article');
      card.className = 'doctor-card';
      card.innerHTML = `
        <div class="doctor-card-media">
          <img src="${doc.portrait}" alt="${doc.name}" loading="lazy">
          <span class="doctor-card-exp-tag">Стаж ${doc.experience}</span>
        </div>
        <div class="doctor-card-body">
          <h3 class="doctor-card-name">${doc.name}</h3>
          <p class="doctor-card-role">${doc.role}</p>
          <p class="doctor-card-practice">${doc.practice}</p>
          <div class="doctor-card-actions">
            <button type="button" class="btn-primary-wire" data-doc-book="${doc.name}" style="padding: 8px 16px; font-size: 0.8rem;">
              Записаться к врачу
            </button>
          </div>
        </div>
      `;

      const bookBtn = card.querySelector('[data-doc-book]');
      if (bookBtn) {
        bookBtn.addEventListener('click', () => {
          openBookingModal(`Врач: ${doc.name} (${doc.role})`);
        });
      }

      el.doctorsGrid.appendChild(card);
    });
  }

  // 7. Render Booking Gateway View
  function renderBooking() {
    const branch = data.branches[state.branch];
    if (el.gatewayAddressText) {
      el.gatewayAddressText.textContent = `${branch.address} (${branch.metro})`;
    }
    if (el.gatewayHoursText) {
      el.gatewayHoursText.textContent = branch.hours;
    }
  }

  // 8. Booking Modal Logic
  function openBookingModal(contextNotice = '') {
    state.modalOpen = true;
    state.modalContext = contextNotice;

    if (el.modalContextNotice) {
      if (contextNotice) {
        el.modalContextNotice.style.display = 'block';
        el.modalContextNotice.textContent = contextNotice;
      } else {
        el.modalContextNotice.style.display = 'none';
      }
    }

    if (el.bookingModal) {
      el.bookingModal.classList.add('is-open');
      el.bookingModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeBookingModal() {
    state.modalOpen = false;
    state.modalContext = null;
    if (el.bookingModal) {
      el.bookingModal.classList.remove('is-open');
      el.bookingModal.setAttribute('aria-hidden', 'true');
    }
  }

  // 9. Event Listeners Setup
  function setupListeners() {
    // Branch Switches
    if (el.btnBranchIspanskie) {
      el.btnBranchIspanskie.addEventListener('click', () => {
        if (state.branch === 'ispanskie') return;
        state.branch = 'ispanskie';
        syncUrl();
        renderHeaderAndRibbon();
        renderServices();
        renderDoctors();
        renderBooking();
      });
    }

    if (el.btnBranchProkshino) {
      el.btnBranchProkshino.addEventListener('click', () => {
        if (state.branch === 'prokshino') return;
        state.branch = 'prokshino';
        syncUrl();
        renderHeaderAndRibbon();
        renderServices();
        renderDoctors();
        renderBooking();
      });
    }

    // Pathway Tabs
    el.pathwayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.pathway;
        if (state.pathway === p) return;
        state.pathway = p;
        syncUrl();
        renderHeaderAndRibbon();
        if (p === 'services') renderServices();
        if (p === 'doctors') renderDoctors();
        if (p === 'booking') renderBooking();
      });
    });

    // Search input
    if (el.navSearchInput) {
      el.navSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderServices();
      });
    }

    // Modal close
    if (el.modalCloseBtn) {
      el.modalCloseBtn.addEventListener('click', closeBookingModal);
    }

    if (el.bookingModal) {
      el.bookingModal.addEventListener('click', (e) => {
        if (e.target === el.bookingModal) {
          closeBookingModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.modalOpen) {
        closeBookingModal();
      }
    });

    // Copy phone button
    if (el.modalCopyPhoneBtn) {
      el.modalCopyPhoneBtn.addEventListener('click', () => {
        const phone = data.branches[state.branch].phoneClean;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(phone);
          if (el.modalCopyFeedback) {
            el.modalCopyFeedback.style.display = 'inline';
            setTimeout(() => {
              el.modalCopyFeedback.style.display = 'none';
            }, 2500);
          }
        }
      });
    }

    // Mobile floating bar triggers
    if (el.mobileFloatCall) {
      el.mobileFloatCall.addEventListener('click', () => {
        window.location.href = `tel:${data.branches[state.branch].phoneClean}`;
      });
    }

    if (el.mobileFloatBook) {
      el.mobileFloatBook.addEventListener('click', () => {
        openBookingModal(`Запись из мобильного меню клиники «${data.branches[state.branch].name}»`);
      });
    }

    // Browser Back / Forward
    window.addEventListener('popstate', () => {
      parseUrlState();
      renderHeaderAndRibbon();
      if (state.pathway === 'services') renderServices();
      if (state.pathway === 'doctors') renderDoctors();
      if (state.pathway === 'booking') renderBooking();
    });
  }

  // Initial Boot
  function init() {
    parseUrlState();
    renderHeaderAndRibbon();
    renderServices();
    renderDoctors();
    renderBooking();
    setupListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
