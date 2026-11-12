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
    document.body.appendChild(actions);
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

  function init() {
    body.classList.add('atlas-4-1-refined');
    closeMenuOnNavigation();
    addGalleryLightbox();
    addBookingContext();
    rememberBookingContext();
    exposeUnavailableStates();
    addResponsiveBookingActions();
    addPremiumHomeSignals();
    if (lastBookingTrigger) lastBookingTrigger.focus({ preventScroll: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

