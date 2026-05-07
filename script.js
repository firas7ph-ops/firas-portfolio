/* ===========================
   LOADER
=========================== */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        revealHero();
      }, 400);
    }
    fill.style.width = progress + '%';
  }, 60);

  document.body.style.overflow = 'hidden';
})();

/* ===========================
   HERO REVEAL
=========================== */
function revealHero() {
  const els = document.querySelectorAll('.hero .reveal-up');
  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 140);
  });
}

/* ===========================
   CUSTOM CURSOR
=========================== */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  if (follower) {
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

/* ===========================
   NAV — SCROLL + HAMBURGER
=========================== */
const nav         = document.getElementById('nav');
const hamburger   = document.getElementById('navHamburger');
const mobileMenu  = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('[data-close]').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ===========================
   SCROLL REVEAL
=========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up').forEach(el => {
  // Skip hero ones — handled by revealHero()
  if (!el.closest('.hero')) revealObserver.observe(el);
});

/* ===========================
   HOVER VIDEOS — play on hover
=========================== */
document.querySelectorAll('.video-item').forEach(item => {
  const video = item.querySelector('video');
  if (!video) return;

  item.addEventListener('mouseenter', () => {
    video.play().then(() => item.classList.add('playing')).catch(() => {});
  });

  item.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
    item.classList.remove('playing');
  });

  // Touch support
  item.addEventListener('click', () => {
    if (video.paused) {
      video.play().then(() => item.classList.add('playing')).catch(() => {});
    } else {
      video.pause();
      item.classList.remove('playing');
    }
  });
});

/* ===========================
   LIGHTBOX
=========================== */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose= document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImages = [];
let currentIndex  = 0;

function openLightbox(imgs, index) {
  currentImages = imgs;
  currentIndex  = index;
  lightboxImg.src = imgs[index];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = currentImages[currentIndex];
    lightboxImg.style.opacity = '1';
  }, 150);
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = currentImages[currentIndex];
    lightboxImg.style.opacity = '1';
  }, 150);
}

lightboxImg.style.transition = 'opacity 0.15s ease';
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// Attach to each project section
document.querySelectorAll('.project-section').forEach(section => {
  const imgs = Array.from(section.querySelectorAll('.grid-img')).map(img => img.src);

  section.querySelectorAll('.grid-img').forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(imgs, i));
  });
});

/* ===========================
   SMOOTH ANCHOR SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===========================
   PARALLAX — subtle on hero portrait
=========================== */
const heroPortrait = document.querySelector('.hero-portrait-img');
if (heroPortrait) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroPortrait.style.transform = `scale(1) translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* ===========================
   PROJECT CARD HOVER — tilt
=========================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===========================
   VIDEO ROW — drag to scroll
=========================== */
document.querySelectorAll('.video-row').forEach(row => {
  let isDown = false, startX, scrollLeft;

  row.addEventListener('mousedown', (e) => {
    isDown = true;
    row.style.cursor = 'grabbing';
    startX     = e.pageX - row.offsetLeft;
    scrollLeft = row.scrollLeft;
  });
  row.addEventListener('mouseleave', () => { isDown = false; row.style.cursor = ''; });
  row.addEventListener('mouseup',    () => { isDown = false; row.style.cursor = ''; });
  row.addEventListener('mousemove',  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - row.offsetLeft;
    const walk = (x - startX) * 1.5;
    row.scrollLeft = scrollLeft - walk;
  });
});
