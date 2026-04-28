// Cursor
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
document.addEventListener('mousemove',e=>{
  if(!document.body.classList.contains('has-mouse')) {
    document.body.classList.add('has-mouse');
  }
  if(cur && ring) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }
});
document.querySelectorAll('a,button,.prod-card,.feat-cell,.cert-box,.pstep').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    if(cur && ring) {
      cur.style.transform='translate(-50%,-50%) scale(3)';
      ring.style.width='56px';
      ring.style.height='56px';
      ring.style.opacity='.25';
    }
  });
  el.addEventListener('mouseleave',()=>{
    if(cur && ring) {
      cur.style.transform='';
      ring.style.width='36px';
      ring.style.height='36px';
      ring.style.opacity='.5';
    }
  });
});

// Nav scroll
window.addEventListener('scroll',()=>{
  const nav = document.getElementById('nav');
  if(nav) nav.classList.toggle('scrolled',scrollY>40);
});

// Counter animation
function countUp(el,target,suffix=''){
  if(!el) return;
  let v=0;const s=target/(2000/16);
  const t=setInterval(()=>{v+=s;if(v>=target){v=target;clearInterval(t);}el.textContent=Math.round(v)+suffix;},16);
}
let done=false;
const kpis = document.querySelector('.hero-kpis');
if(kpis) {
  const io=new IntersectionObserver(ents=>{
    if(ents[0].isIntersecting&&!done){done=true;
      setTimeout(()=>{
        countUp(document.getElementById('k1'),240);
        countUp(document.getElementById('k2'),12);
        countUp(document.getElementById('k3'),350);
        countUp(document.getElementById('k4'),15);
      },600);
    }
  },{threshold:.5});
  io.observe(kpis);
}

// Reveal on scroll
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
if(revealEls.length > 0) {
  const ro=new IntersectionObserver(ents=>{
    ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target);}});
  },{threshold:.12});
  revealEls.forEach(el=>ro.observe(el));
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('sidebar-overlay');
  
  if(burger && menu) {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
    if(overlay) overlay.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  }
}

// Ensure menu closes on resize
window.addEventListener('resize', () => {
  if(window.innerWidth > 1024) {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('sidebar-overlay');
    if(menu && menu.classList.contains('active')) {
      burger.classList.remove('active');
      menu.classList.remove('active');
      if(overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// KP Modal
const kpModalOverlay=document.getElementById('kp-modal-overlay');
const kpForm=document.getElementById('kp-form');

function openKpModal(fromMobileMenu=false){
  if(!kpModalOverlay) return;
  const menu=document.getElementById('mobile-menu');
  const burger=document.getElementById('burger');
  const overlay=document.getElementById('sidebar-overlay');
  const menuIsOpen=menu && menu.classList.contains('active');
  if(fromMobileMenu||menuIsOpen){
    if(menuIsOpen){
      menu.classList.remove('active');
      if(burger) burger.classList.remove('active');
      if(overlay) overlay.classList.remove('open');
    }
    setTimeout(()=>{
      kpModalOverlay.classList.add('open');
      kpModalOverlay.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    },180);
    return;
  }
  kpModalOverlay.classList.add('open');
  kpModalOverlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closeKpModal(){
  if(!kpModalOverlay) return;
  kpModalOverlay.classList.remove('open');
  kpModalOverlay.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

document.querySelectorAll('[data-open-kp]').forEach(btn=>{
  btn.addEventListener('click',(e)=>{
    e.preventDefault();
    const menu=document.getElementById('mobile-menu');
    const menuIsOpen=menu && menu.classList.contains('active');
    if(menuIsOpen){
      openKpModal(true);
      return;
    }
    openKpModal();
  });
});

document.querySelectorAll('[data-close-kp]').forEach(btn=>{
  btn.addEventListener('click',closeKpModal);
});

if(kpModalOverlay){
  kpModalOverlay.addEventListener('click',e=>{
    if(e.target===kpModalOverlay) closeKpModal();
  });
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape' && kpModalOverlay && kpModalOverlay.classList.contains('open')){
    closeKpModal();
  }
});

// Form submission is handled by the server (Django)
// to ensure leads are captured in the database.
// The "Thanks" page handles the WhatsApp redirect if needed.

window.openKpModal=openKpModal;
window.closeKpModal=closeKpModal;
