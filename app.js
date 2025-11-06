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

  const openModal = (src, alt) => {
    if (!modal || !modalImage) return;
    modalImage.src = src;
    modalImage.alt = alt;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.dataset.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal || !modalImage) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    modalImage.alt = '';
    if (document.body.dataset.previousOverflow !== undefined) {
      document.body.style.overflow = document.body.dataset.previousOverflow;
      delete document.body.dataset.previousOverflow;
    } else {
      document.body.style.overflow = '';
    }
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

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal?.classList.contains('is-visible')) {
      closeModal();
    }
  });
});