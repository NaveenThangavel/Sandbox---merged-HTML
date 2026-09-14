/* ============================================================
   NAVEEN PORTFOLIO — OPTIMIZED INTERACTION SCRIPT
   ============================================================ */


/* ---------- Optional hero portrait ---------- */

document.querySelectorAll('.hero-photo-slot').forEach(slot => {
  const src = (slot.dataset.photo || '').trim();

  if (!src) return;

  const img = document.createElement('img');

  img.src = src;
  img.alt = 'Naveen Thangavel portrait';
  img.loading = 'eager';

  slot.replaceChildren(img);
  slot.classList.add('has-photo');
});


/* ---------- Reveal animation ---------- */

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});


/* ============================================================
   GOOGLE DRIVE THUMBNAILS
   ============================================================ */

function getDriveFileId(url) {
  if (!url) return '';

  const match = url.match(
    /drive\.google\.com\/file\/d\/([^/]+)/i
  );

  return match ? match[1] : '';
}


/* ============================================================
   VIDEO RATIO DETECTION
   9:16 = Reel / Short / Social
   16:9 = Landscape / normal video
   ============================================================ */

function getVideoRatio(card) {

  if (!card) return '16/9';

  const explicitRatio =
    (card.dataset.videoRatio || '').trim();

  if (
    explicitRatio === '9/16' ||
    explicitRatio === '16/9'
  ) {
    return explicitRatio;
  }

  /* Fallback for cards without data-video-ratio */

  const text =
    (card.innerText || '').toLowerCase();

  if (
    text.includes('reel') ||
    text.includes('short form') ||
    text.includes('social')
  ) {
    return '9/16';
  }

  return '16/9';
}


/* ============================================================
   CREATE DRIVE THUMBNAIL
   ============================================================ */

function setCardThumbnail(card) {

  const thumb = card.querySelector('.thumb');
  const url = (card.dataset.video || '').trim();

  if (!thumb || !url) return;

  /*
     If you manually added a thumbnail,
     don't replace it.
  */

  if (
    thumb.querySelector(
      'img, video, iframe, .media'
    )
  ) {
    return;
  }

  const driveId = getDriveFileId(url);

  if (!driveId) return;

  const img = document.createElement('img');

  img.src =
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1000`;

  img.alt =
    card.dataset.title || 'Portfolio video';

  img.loading = 'lazy';
  img.decoding = 'async';

  img.addEventListener('error', () => {
    thumb.classList.add('thumbnail-fallback');
  }, {
    once: true
  });

  thumb.replaceChildren(img);

  thumb.classList.add('has-thumbnail');
}


/* ---------- Generate thumbnails ---------- */

document
  .querySelectorAll('.card[data-video]')
  .forEach(card => {
    setCardThumbnail(card);
  });


/* ============================================================
   VIDEO MODAL
   ============================================================ */

const modal =
  document.getElementById('modal');

const modalTitle =
  document.getElementById('modalTitle');

const videoBox =
  document.getElementById('videoBox');

const closeModalButton =
  document.getElementById('closeModal');


/* ---------- Close modal ---------- */

function closeVideoModal() {

  if (!modal) return;

  modal.classList.remove('open');
  modal.classList.remove('is-vertical');
  modal.classList.remove('is-horizontal');

  if (videoBox) {
    videoBox.replaceChildren();
  }

  modal.setAttribute(
    'aria-hidden',
    'true'
  );

  document.body.classList.remove(
    'modal-open'
  );
}


/* ---------- Open modal ---------- */

function openVideo(title, url, card) {

  if (
    !modal ||
    !modalTitle ||
    !videoBox
  ) {
    return;
  }

  const cleanUrl =
    (url || '').trim();

  const ratio =
    getVideoRatio(card);

  modalTitle.textContent =
    title || 'Video Preview';


  /* ----------------------------------------
     Set modal orientation
     ---------------------------------------- */

  modal.classList.toggle(
    'is-vertical',
    ratio === '9/16'
  );

  modal.classList.toggle(
    'is-horizontal',
    ratio !== '9/16'
  );


  /* ----------------------------------------
     Clear previous video
     ---------------------------------------- */

  videoBox.replaceChildren();


  /* ----------------------------------------
     Load video
     ---------------------------------------- */

  if (cleanUrl) {

    const iframe =
      document.createElement('iframe');

    iframe.src = cleanUrl;

    iframe.title =
      title || 'Portfolio video';

    iframe.allow =
      'autoplay; fullscreen; picture-in-picture; encrypted-media';

    iframe.setAttribute(
      'allowfullscreen',
      ''
    );

    iframe.setAttribute(
      'playsinline',
      ''
    );

    videoBox.appendChild(iframe);

  } else {

    const message =
      document.createElement('p');

    message.innerHTML =
      'Video link is not added yet. Add a Google Drive <strong>/preview</strong> link to this card.';

    videoBox.appendChild(message);
  }


  /* ----------------------------------------
     Show modal
     ---------------------------------------- */

  modal.classList.add('open');

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'modal-open'
  );
}


/* ============================================================
   CARD CLICK HANDLING
   ============================================================ */

document
  .querySelectorAll('.card[data-title]')
  .forEach(card => {

    card.addEventListener('click', () => {

      openVideo(
        card.dataset.title,
        card.dataset.video,
        card
      );

    });

  });


/* ============================================================
   CLOSE BUTTON
   ============================================================ */

if (closeModalButton) {

  closeModalButton.addEventListener(
    'click',
    closeVideoModal
  );

}


/* ============================================================
   CLICK OUTSIDE MODAL
   ============================================================ */

if (modal) {

  modal.addEventListener(
    'click',
    event => {

      if (event.target === modal) {
        closeVideoModal();
      }

    }
  );

}


/* ============================================================
   ESCAPE KEY
   ============================================================ */

document.addEventListener(
  'keydown',
  event => {

    if (
      event.key === 'Escape' &&
      modal &&
      modal.classList.contains('open')
    ) {
      closeVideoModal();
    }

  }
);


/* ============================================================
   AUTO-SCROLLING VIDEO RAILS
   ============================================================ */

(function () {

  const rails =
    document.querySelectorAll(
      '.skill-zone .card-grid'
    );

  rails.forEach(rail => {

    let timer = null;


    function step() {

      if (
        rail.scrollWidth <=
        rail.clientWidth + 4
      ) {
        return;
      }

      const max =
        rail.scrollWidth -
        rail.clientWidth;

      const amount =
        Math.max(
          rail.clientWidth * 0.72,
          220
        );

      const next =
        rail.scrollLeft >= max - 8
          ? 0
          : Math.min(
              rail.scrollLeft + amount,
              max
            );

      rail.scrollTo({
        left: next,
        behavior: 'smooth'
      });

    }


    function start() {

      clearInterval(timer);

      timer =
        setInterval(
          step,
          4200
        );

    }


    function stop() {

      clearInterval(timer);

      timer = null;

    }


    /* Desktop hover */

    rail.addEventListener(
      'mouseenter',
      stop
    );

    rail.addEventListener(
      'mouseleave',
      start
    );


    /* Mobile touch */

    rail.addEventListener(
      'touchstart',
      stop,
      {
        passive: true
      }
    );

    rail.addEventListener(
      'touchend',
      start,
      {
        passive: true
      }
    );


    /* Keyboard focus */

    rail.addEventListener(
      'focusin',
      stop
    );

    rail.addEventListener(
      'focusout',
      start
    );


    start();

  });

})();


/* ============================================================
   MANUAL THUMBNAIL SUPPORT
   If data-thumb exists, it takes priority.
   ============================================================ */

document
  .querySelectorAll('.thumb[data-thumb]')
  .forEach(thumb => {

    const src =
      (
        thumb.getAttribute(
          'data-thumb'
        ) || ''
      ).trim();

    if (!src) return;


    const img =
      document.createElement('img');

    img.src = src;

    img.alt =
      'Portfolio thumbnail';

    img.loading = 'lazy';

    thumb.replaceChildren(img);

    thumb.classList.add(
      'has-thumbnail'
    );

  });
