// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let rx = 0, ry = 0;

// Use a continuous loop for the ring for better performance and smoothness
function updateRing() {
  rx += (mouseX - rx) * 0.15;
  ry += (mouseY - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(updateRing);
}
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});
updateRing();

document.querySelectorAll('a, button, .product-card, .europe-card, .cert-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.width = '60px'; ring.style.height = '60px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '40px'; ring.style.height = '40px';
  });
});

// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// Counter animation
function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + suffix;
  }, 16);
}

const countersStarted = { done: false };
const heroStats = document.querySelector('.hero-stats');
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted.done) {
    countersStarted.done = true;
    setTimeout(() => {
      animateCounter(document.getElementById('count1'), 2400, '+');
      animateCounter(document.getElementById('count2'), 12, '+');
      animateCounter(document.getElementById('count3'), 350, '+');
    }, 800);
  }
}, { threshold: 0.5 });
if (heroStats) observer.observe(heroStats);

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .feature-row, .product-card, .europe-card, .cert-item, .process-step');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), (entry.target.dataset.delay || 0) * 100);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach((el, i) => {
  revealObs.observe(el);
});

// Stagger product cards
document.querySelectorAll('.product-card').forEach((el, i) => {
  el.dataset.delay = i;
});

// Ticker duplicate for seamless loop
const ticker = document.getElementById('ticker');
if (ticker) ticker.innerHTML += ticker.innerHTML;

// Modal functions
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
