// Optional hero portrait: set data-photo="images/naveen.jpg" on .hero-photo-slot.
document.querySelectorAll('.hero-photo-slot').forEach(slot => {
  const src = (slot.dataset.photo || '').trim();
  if (!src) return;

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Naveen Thangavel portrait';

  slot.appendChild(img);
  slot.classList.add('has-photo');
});


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: .14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const videoBox = document.getElementById('videoBox');

function openVideo(title, url) {
  modalTitle.textContent = title || 'Video Preview';

  if (url && url.trim()) {
    videoBox.innerHTML = `
      <iframe
        src="${url}"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  } else {
    videoBox.innerHTML = `
      <p>
        Video link is not added yet. Replace this card's
        <strong>data-video</strong> value with your YouTube embed link,
        Vimeo embed link, or Drive preview link.
      </p>
    `;
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}


document.querySelectorAll('[data-title]').forEach(el => {
  el.addEventListener('click', () => {
    openVideo(el.dataset.title, el.dataset.video);
  });
});


document.getElementById('closeModal').addEventListener('click', () => {
  modal.classList.remove('open');
  videoBox.innerHTML = '';
  modal.setAttribute('aria-hidden', 'true');
});


modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
    videoBox.innerHTML = '';
    modal.setAttribute('aria-hidden', 'true');
  }
});


(function () {
  const rails = document.querySelectorAll('.skill-zone .card-grid');

  rails.forEach(rail => {
    let timer;

    const step = () => {
      if (rail.scrollWidth <= rail.clientWidth + 4) return;

      const max = rail.scrollWidth - rail.clientWidth;

      const next =
        rail.scrollLeft >= max - 8
          ? 0
          : rail.scrollLeft +
            Math.max(rail.clientWidth * .72, 220);

      rail.scrollTo({
        left: next,
        behavior: 'smooth'
      });
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(step, 4200);
    };

    const stop = () => clearInterval(timer);

    rail.addEventListener('mouseenter', stop);
    rail.addEventListener('mouseleave', start);

    rail.addEventListener('touchstart', stop, {
      passive: true
    });

    rail.addEventListener('touchend', start, {
      passive: true
    });

    start();
  });
})();


(function () {
  document.querySelectorAll('.thumb[data-thumb]').forEach(thumb => {
    const src = (thumb.getAttribute('data-thumb') || '').trim();

    if (!src) return;

    const img = document.createElement('img');

    img.src = src;
    img.alt = 'Portfolio thumbnail';
    img.loading = 'lazy';

    thumb.replaceChildren(img);
  });
})();