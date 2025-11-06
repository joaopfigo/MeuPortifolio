document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const filename = currentPath.split('/').pop() || 'index.html';

  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => {
    if (link.getAttribute('href') === filename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const profileIcon = document.querySelector('.profile-icon circle');
  if (profileIcon) {
    profileIcon.setAttribute('fill', 'url(your-profile-photo.jpg)');
  }

  document.body.style.backgroundImage = 'url(your-background-image.jpg)';

  const modal = document.getElementById('imageModal');
  const modalImage = modal ? modal.querySelector('.image-modal__img') : null;
  const modalClose = modal ? modal.querySelector('[data-modal-close]') : null;
  const modalOverlay = modal ? modal.querySelector('[data-modal-overlay]') : null;
  const triggers = document.querySelectorAll('.project-image-trigger');
  const carousels = document.querySelectorAll('[data-carousel]');
  const serviceModals = document.querySelectorAll('.service-modal');

  const bodyScrollLock = (() => {
    const depthKey = 'modalDepth';

    const lock = () => {
      const currentDepth = parseInt(document.body.dataset[depthKey] || '0', 10);
      if (currentDepth === 0) {
        document.body.dataset.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      document.body.dataset[depthKey] = String(currentDepth + 1);
    };

    const unlock = () => {
      const currentDepth = parseInt(document.body.dataset[depthKey] || '0', 10);
      if (currentDepth <= 1) {
        if (document.body.dataset.previousOverflow !== undefined) {
          document.body.style.overflow = document.body.dataset.previousOverflow;
          delete document.body.dataset.previousOverflow;
        } else {
          document.body.style.overflow = '';
        }
        delete document.body.dataset[depthKey];
        return;
      }

      document.body.dataset[depthKey] = String(currentDepth - 1);
    };

    return { lock, unlock };
  })();

  const openModal = (src, alt) => {
    if (!modal || !modalImage) return;
    modalImage.src = src;
    modalImage.alt = alt;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    bodyScrollLock.lock();
  };

  const closeModal = () => {
    if (!modal || !modalImage || !modal.classList.contains('is-visible')) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    modalImage.alt = '';
    bodyScrollLock.unlock();
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imageSrc = trigger.getAttribute('data-image');
      const imageAlt = trigger.getAttribute('data-alt') || '';
      if (imageSrc) {
        openModal(imageSrc, imageAlt);
      }
    });
  });

  carousels.forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');

    if (!track) {
      return;
    }

    const scrollByAmount = direction => {
      const amount = track.clientWidth * 0.9;
      track.scrollBy({ left: amount * direction, behavior: 'smooth' });
    };

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (prevButton) {
        prevButton.disabled = track.scrollLeft <= 1;
      }
      if (nextButton) {
        nextButton.disabled = track.scrollLeft >= maxScroll - 1;
      }
    };

    prevButton?.addEventListener('click', () => {
      scrollByAmount(-1);
    });

    nextButton?.addEventListener('click', () => {
      scrollByAmount(1);
    });

    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    updateControls();
  });

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  const serviceModalState = new WeakMap();

  const focusInitialElement = modalElement => {
    const explicitTarget = modalElement.querySelector('[data-service-modal-initial-focus]');
    if (explicitTarget instanceof HTMLElement) {
      explicitTarget.focus({ preventScroll: true });
      return;
    }

    const fallback = modalElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (fallback instanceof HTMLElement) {
      fallback.focus({ preventScroll: true });
    }
  };

  const openServiceModal = modalElement => {
    if (!(modalElement instanceof HTMLElement) || modalElement.classList.contains('is-visible')) {
      return;
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    serviceModalState.set(modalElement, { previouslyFocused });

    modalElement.classList.add('is-visible');
    modalElement.setAttribute('aria-hidden', 'false');
    bodyScrollLock.lock();
    focusInitialElement(modalElement);
  };

  const closeServiceModal = modalElement => {
    if (!(modalElement instanceof HTMLElement) || !modalElement.classList.contains('is-visible')) {
      return;
    }

    modalElement.classList.remove('is-visible');
    modalElement.setAttribute('aria-hidden', 'true');
    bodyScrollLock.unlock();

    const state = serviceModalState.get(modalElement);
    if (state?.previouslyFocused instanceof HTMLElement) {
      state.previouslyFocused.focus({ preventScroll: true });
    }
    serviceModalState.delete(modalElement);
  };

  const getModalById = id => {
    if (!id) return null;
    return document.getElementById(id);
  };

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-service-modal-target]');
    if (trigger instanceof HTMLElement) {
      event.preventDefault();
      const targetId = trigger.getAttribute('data-service-modal-target');
      const modalElement = getModalById(targetId);
      if (modalElement) {
        openServiceModal(modalElement);
      }
      return;
    }

    const closeTrigger = event.target.closest('[data-service-modal-close]');
    if (closeTrigger instanceof HTMLElement) {
      const modalElement = closeTrigger.closest('.service-modal');
      if (modalElement) {
        closeServiceModal(modalElement);
      }
    }
  });

  serviceModals.forEach(modalElement => {
    modalElement.setAttribute('aria-hidden', modalElement.classList.contains('is-visible') ? 'false' : 'true');
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const visibleServiceModal = document.querySelector('.service-modal.is-visible');
      if (visibleServiceModal) {
        event.preventDefault();
        closeServiceModal(visibleServiceModal);
        return;
      }

      if (modal?.classList.contains('is-visible')) {
        closeModal();
      }
    }
  });
});