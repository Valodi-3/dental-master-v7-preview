(function () {
  'use strict';

  const body = document.body;
  if (!body || body.dataset.atlasVersion !== '4-1') return;

  const branch = body.dataset.clinic || '';
  const branchName = branch === 'prokshino' ? 'Прокшино' : branch === 'ispanskie' ? 'Испанские кварталы' : 'сеть ДантистЪ';
  let lastBookingTrigger = null;

  function closeMenuOnNavigation() {
    const nav = document.querySelector('[data-primary-nav]');
    const toggle = document.querySelector('[data-menu-toggle]');
    if (!nav || !toggle) return;
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  function addGalleryLightbox() {
    const images = [...document.querySelectorAll('.gallery-photo img, [data-gallery-item] img')];
    if (!images.length || document.querySelector('.atlas-4-1-lightbox')) return;
    const lightbox = document.createElement('div');
    lightbox.className = 'atlas-4-1-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Просмотр фотографии');
    lightbox.innerHTML = '<button type="button" aria-label="Закрыть фото">×</button><figure><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lightbox);
    const close = lightbox.querySelector('button');
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let returnFocus = null;
    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.removeProperty('overflow');
      if (returnFocus) returnFocus.focus({ preventScroll: true });
    };
    const openLightbox = (source) => {
      returnFocus = source;
      const sourceImage = source.matches('img') ? source : source.querySelector('img');
      if (!sourceImage) return;
      image.src = sourceImage.currentSrc || sourceImage.src;
      image.alt = sourceImage.alt || 'Фотография клиники ДантистЪ';
      caption.textContent = sourceImage.alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      close.focus({ preventScroll: true });
    };
    images.forEach((item) => {
      const trigger = item.closest('.gallery-photo, [data-gallery-item]') || item;
      trigger.classList.add('atlas-4-1-gallery-trigger');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-label', `Открыть фото: ${item.alt || 'клиника ДантистЪ'}`);
      trigger.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        openLightbox(trigger);
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(trigger);
        }
      });
    });
    close.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (event) => { if (!lightbox.hidden && event.key === 'Escape') closeLightbox(); });
  }

  function addBookingContext() {
    const dialog = document.querySelector('[data-booking-dialog]');
    if (!dialog || dialog.querySelector('.atlas-4-1-booking-context')) return;
    const context = document.createElement('div');
    context.className = 'atlas-4-1-booking-context booking-data-note';
    context.setAttribute('role', 'status');
    context.innerHTML = `<strong>Контекст: ${branchName}</strong><span data-atlas-4-1-service-context>Выбранная услуга будет показана только для ориентира.</span>`;
    const anchor = dialog.querySelector('[data-booking-service]') || dialog.querySelector('.booking-dialog-inner')?.firstElementChild || dialog.firstElementChild;
    const parent = anchor?.parentElement || dialog;
    parent.insertBefore(context, anchor || null);
  }

  function addBookingBranchFlow() {
    const dialog = document.querySelector('[data-booking-dialog]');
    const choices = dialog?.querySelector('[data-booking-step="choices"]');
    if (!dialog || !choices || choices.querySelector('.atlas-4-1-booking-branch-step')) return;

    const branches = {
      ispanskie: {
        label: 'Испанские кварталы',
        online: false,
        notice: 'Проверенной онлайн-ссылки DentalPRO для этого филиала в текущей конфигурации нет. Используйте телефон или подтверждённый мессенджер.',
      },
      prokshino: {
        label: 'Прокшино',
        online: true,
        notice: 'Официальная страница DentalPRO ведёт в филиал Прокшино. Последняя проверка виджета вернула «Токен не найден», поэтому свободные окна нужно подтвердить во внешней системе.',
      },
    };
    const defaultBranch = branches[branch] ? branch : 'prokshino';
    let selectedBranch = defaultBranch;

    const branchStep = document.createElement('section');
    branchStep.className = 'atlas-4-1-booking-branch-step';
    branchStep.setAttribute('aria-labelledby', 'atlas-booking-branch-title');
    branchStep.innerHTML = '<div class="atlas-4-1-booking-step-heading"><span class="choice-kicker">ШАГ 1 · ФИЛИАЛ</span><h3 id="atlas-booking-branch-title">Выберите филиал</h3></div>'
      + '<div class="atlas-4-1-booking-branch-options" role="group" aria-label="Филиал записи">'
      + '<button type="button" class="atlas-4-1-booking-branch-option" data-booking-branch="ispanskie" aria-pressed="false">Испанские кварталы</button>'
      + '<button type="button" class="atlas-4-1-booking-branch-option" data-booking-branch="prokshino" aria-pressed="false">Прокшино</button>'
      + '</div>'
      + '<p class="atlas-4-1-booking-branch-status" data-booking-branch-status role="status" aria-live="polite"></p>';

    const serviceSummary = dialog.querySelector('[data-booking-service]');
    const serviceNote = dialog.querySelector('[data-booking-service-note]');
    const serviceStep = document.createElement('section');
    serviceStep.className = 'atlas-4-1-booking-service-step';
    serviceStep.setAttribute('aria-labelledby', 'atlas-booking-service-title');
    serviceStep.innerHTML = '<div class="atlas-4-1-booking-step-heading"><span class="choice-kicker">ШАГ 2 · УСЛУГА</span><h3 id="atlas-booking-service-title">Проверьте направление</h3></div>'
      + '<p class="atlas-4-1-booking-service-empty" data-booking-service-empty>Услуга не выбрана на этой странице. Выберите позицию в каталоге или укажите её повторно во внешней системе.</p>';
    if (serviceSummary) serviceStep.append(serviceSummary);
    if (serviceNote) serviceStep.append(serviceNote);

    const title = choices.querySelector('h2, h3');
    const channelLabel = document.createElement('span');
    channelLabel.className = 'choice-kicker atlas-4-1-booking-channel-label';
    channelLabel.textContent = 'ШАГ 3 · СПОСОБ ЗАПИСИ';
    if (title) title.before(channelLabel);
    choices.prepend(serviceStep);
    choices.prepend(branchStep);

    const branchStatus = branchStep.querySelector('[data-booking-branch-status]');
    const serviceEmpty = serviceStep.querySelector('[data-booking-service-empty]');
    const summary = serviceSummary;
    const onlineCards = [...dialog.querySelectorAll('.booking-choice-online')];
    const branchNotice = dialog.querySelector('.dialog-notice-branch');
    const selectedContext = dialog.querySelector('.atlas-4-1-booking-context');

    function serviceIsSelected() {
      return Boolean(summary && !summary.hidden && summary.textContent.trim());
    }

    function syncServiceStep() {
      const selected = serviceIsSelected();
      if (serviceEmpty) serviceEmpty.hidden = selected;
      serviceStep.classList.toggle('has-selection', selected);
    }

    function updateOnlineCard(card, config) {
      const kicker = card.querySelector('.choice-kicker');
      const heading = card.querySelector('h2, h3');
      const description = [...card.querySelectorAll('p:not(.choice-kicker)')].find((node) => !node.matches('[data-atlas-dentalpro-warning]'));
      const link = card.querySelector('[data-atlas-dentalpro-link]')
        || card.querySelector('a[href*="online-zapis"], a[href*="dental-pro"], a.button');
      if (kicker) kicker.textContent = config.online ? 'ОНЛАЙН · ФИЛИАЛ ПРОКШИНО' : 'ОНЛАЙН · НЕ ПОДТВЕРЖДЕНО';
      if (heading) heading.textContent = config.online ? 'DentalPRO · Прокшино' : 'Онлайн-запись Испанских кварталов';
      if (description) description.textContent = config.online
        ? 'Официальная страница записи филиала Прокшино. Свободные окна, врач и услуга подтверждаются только во внешней системе.'
        : 'Для Испанских кварталов нет подтверждённой ссылки DentalPRO. Используйте телефон или подтверждённый мессенджер.';
      let warning = card.querySelector('[data-atlas-dentalpro-warning]');
      if (!warning) {
        warning = document.createElement('p');
        warning.className = 'atlas-4-1-dentalpro-warning';
        warning.dataset.atlasDentalproWarning = 'true';
        warning.setAttribute('role', 'status');
        card.querySelector('.booking-card-actions')?.before(warning);
      }
      warning.textContent = config.notice;
      card.classList.toggle('is-unavailable', !config.online);
      if (link) {
        link.dataset.atlasDentalproLink = 'true';
        if (config.online) {
          link.href = 'https://dantist-prokshino.ru/online-zapis/';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Открыть страницу DentalPRO · Прокшино ↗';
          link.removeAttribute('aria-disabled');
          link.removeAttribute('tabindex');
          link.classList.remove('button-light');
          link.classList.add('button-primary');
        } else {
          link.removeAttribute('href');
          link.removeAttribute('target');
          link.removeAttribute('rel');
          link.setAttribute('aria-disabled', 'true');
          link.setAttribute('tabindex', '-1');
          link.classList.remove('button-primary');
          link.classList.add('button-light');
          link.textContent = 'Онлайн-ссылка филиала не подтверждена';
        }
      }
    }

    function selectBranch(nextBranch, focusButton = false) {
      if (!branches[nextBranch]) return;
      selectedBranch = nextBranch;
      dialog.dataset.selectedBranch = nextBranch;
      branchStep.querySelectorAll('[data-booking-branch]').forEach((button) => {
        const active = button.dataset.bookingBranch === selectedBranch;
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', String(active));
        if (active && focusButton) button.focus({ preventScroll: true });
      });
      const config = branches[selectedBranch];
      if (branchStatus) branchStatus.textContent = `Выбран филиал: ${config.label}.`;
      if (branchNotice) branchNotice.textContent = `Важно: ${config.notice}`;
      if (selectedContext) {
        const contextStrong = selectedContext.querySelector('strong');
        if (contextStrong) contextStrong.textContent = `Контекст: ${config.label}`;
      }
      onlineCards.forEach((card) => updateOnlineCard(card, config));
    }

    branchStep.addEventListener('click', (event) => {
      const button = event.target.closest('[data-booking-branch]');
      if (button) selectBranch(button.dataset.bookingBranch, true);
    });
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-booking]');
      if (!trigger) return;
      selectBranch(branch, false);
      syncServiceStep();
    }, true);
    if (summary) {
      const observer = new MutationObserver(syncServiceStep);
      observer.observe(summary, { attributes: true, childList: true, subtree: true, characterData: true });
    }
    dialog.addEventListener('close', () => selectBranch(branch, false));
    selectBranch(defaultBranch, false);
    syncServiceStep();
  }

  function rememberBookingContext() {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-booking]');
      if (!trigger) return;
      lastBookingTrigger = trigger;
      const serviceId = trigger.dataset.serviceId || '';
      try { sessionStorage.setItem('atlas-4-1-booking-context', JSON.stringify({ branch, serviceId })); } catch (_) { /* private mode */ }
      const context = document.querySelector('[data-atlas-4-1-service-context]');
      if (context) context.textContent = serviceId ? `Услуга выбрана для ориентира (код ${serviceId}); слоты и назначение врача проверяются во внешней системе.` : 'Услуга будет выбрана во внешней системе записи.';
    }, true);
  }

  function exposeUnavailableStates() {
    const page = body.dataset.page;
    if (page === 'contacts' && branch === 'ispanskie') {
      const notice = document.querySelector('.dialog-notice-branch, .booking-card p');
      if (notice && !notice.dataset.atlasV4Checked) {
        notice.dataset.atlasV4Checked = 'true';
        notice.insertAdjacentText('afterbegin', 'Важно: ');
      }
    }
    document.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        image.closest('figure, .selected-procedure-image, .doctor-photo-link')?.classList.add('is-unavailable');
        image.setAttribute('aria-label', 'Изображение временно недоступно');
      }, { once: true });
    });
  }

  function addResponsiveBookingActions() {
    if (!document.querySelector('[data-booking-dialog]')) return;
    const headerInner = document.querySelector('.header-inner');
    if (headerInner && !headerInner.querySelector('.atlas-4-1-header-booking')) {
      const headerButton = document.createElement('button');
      headerButton.type = 'button';
      headerButton.className = 'atlas-4-1-header-booking';
      headerButton.dataset.openBooking = '';
      headerButton.textContent = 'Записаться';
      headerInner.appendChild(headerButton);
    }

    if (document.querySelector('.atlas-4-1-mobile-actions')) return;
    const phone = document.querySelector('a[href^="tel:"]');
    const contactHref = phone?.getAttribute('href') || 'tel:+79045199697';
    const actions = document.createElement('div');
    actions.className = 'atlas-4-1-mobile-actions';
    actions.innerHTML = '<button type="button" class="button button-primary" data-open-booking>Записаться</button>'
      + `<a class="button button-secondary" href="${contactHref}">Связаться</a>`;
    const footer = document.querySelector('.v2-footer');
    if (footer) footer.before(actions);
    else document.body.appendChild(actions);
  }

  function refineCarouselControls() {
    document.querySelectorAll('[data-doctor-carousel]').forEach((carousel, index) => {
      const track = carousel.querySelector('[data-doctor-track]');
      if (!track) return;
      const note = carousel.parentElement?.querySelector('.doctor-carousel-note');
      if (note && !note.dataset.atlasV4UxHint) {
        note.dataset.atlasV4UxHint = 'true';
        note.textContent = `${note.textContent.trim()} Свайпните карточки по горизонтали или используйте стрелки.`;
      }
      if (note) {
        if (!note.id) note.id = `doctor-carousel-note-${index + 1}`;
        track.setAttribute('aria-describedby', note.id);
      }
      const previous = document.querySelector(`[data-doctor-prev][aria-controls="${track.id}"]`);
      const next = document.querySelector(`[data-doctor-next][aria-controls="${track.id}"]`);
      previous?.setAttribute('title', 'Показать предыдущую карточку');
      next?.setAttribute('title', 'Показать следующую карточку');
      previous?.setAttribute('aria-keyshortcuts', 'ArrowLeft');
      next?.setAttribute('aria-keyshortcuts', 'ArrowRight');
    });
  }

  function addPremiumHomeSignals() {
    if (body.dataset.page !== 'home' || document.querySelector('.atlas-4-1-proof-strip')) return;
    const hero = document.querySelector('.home-hero');
    if (!hero) return;
    const strip = document.createElement('section');
    strip.className = 'atlas-4-1-proof-strip';
    strip.setAttribute('aria-label', 'Факты о филиале');
    strip.innerHTML = '<div class="shell atlas-4-1-proof-grid">'
      + '<div class="atlas-4-1-proof-item"><strong>254</strong><span>позиции в открытом прайсе</span></div>'
      + '<div class="atlas-4-1-proof-item"><strong>5</strong><span>специалистов в каталоге филиала</span></div>'
      + '<div class="atlas-4-1-proof-item"><strong>09–21</strong><span>ежедневный режим работы</span></div>'
      + '</div>';
    hero.after(strip);
    document.querySelector('.clinic-strip')?.classList.add('atlas-4-1-gallery-section');
    document.querySelector('.team-strip')?.classList.add('atlas-4-1-team-section');
    document.querySelector('.selector-section')?.classList.add('atlas-4-1-catalog-section');
    document.querySelector('.contact-band')?.classList.add('atlas-4-1-contact-section');
  }

  function applyHeroPhotography() {
    if (body.dataset.page !== 'home') return;
    const image = document.querySelector('.welcome-photo img');
    if (!image) return;
    const photography = branch === 'ispanskie'
      ? { src: '../../design/assets/ispanskie/gallery-3.jpg', alt: 'Врачи обсуждают снимок в кабинете стоматологии Испанских кварталов' }
      : { src: '../../design/assets/prokshino/treatment.webp', alt: 'Врач проводит стоматологический приём в клинике Прокшино' };
    image.src = photography.src;
    image.alt = photography.alt;
    image.setAttribute('fetchpriority', 'high');
  }

  function init() {
    body.classList.add('atlas-4-1-refined');
    closeMenuOnNavigation();
    addGalleryLightbox();
    addBookingContext();
    addBookingBranchFlow();
    rememberBookingContext();
    exposeUnavailableStates();
    addResponsiveBookingActions();
    refineCarouselControls();
    addPremiumHomeSignals();
    applyHeroPhotography();
    if (lastBookingTrigger) lastBookingTrigger.focus({ preventScroll: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

