// Cursor
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
document.addEventListener('mousemove',e=>{
  if(cur && ring) {
    cur.style.cssText=`left:${e.clientX}px;top:${e.clientY}px`;
    ring.style.cssText=`left:${e.clientX}px;top:${e.clientY}px`;
  }
});
document.querySelectorAll('a,button,.pcard,.fcat-pill,.filter-opt').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    if(cur && ring) {
      cur.style.transform='translate(-50%,-50%) scale(2.5)';
      ring.style.width='52px';
      ring.style.height='52px';
      ring.style.opacity='.2';
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

// Show cards with stagger
const cards=document.querySelectorAll('.pcard');
cards.forEach((c,i)=>{setTimeout(()=>c.classList.add('shown'),100+i*60)});

// Filter category (hero pills)
function filterCategory(cat,el){
  document.querySelectorAll('.fcat-pill').forEach(p=>p.classList.remove('active'));
  if(el) el.classList.add('active');
  // Sync sidebar
  document.querySelectorAll('#cat-filters .filter-opt').forEach(o=>{
    o.classList.toggle('checked',o.dataset.cat===cat||cat==='all');
  });
  filterCards();
}

// Sidebar filter toggle
function toggleFilter(el,group){
  if(el) el.classList.toggle('checked');
  filterCards();
}

function filterCards(){
  const checkedCats=[...document.querySelectorAll('#cat-filters .filter-opt.checked')].map(o=>o.dataset.cat);
  const showAll=checkedCats.includes('all')||checkedCats.length===0;
  let count=0;
  cards.forEach(c=>{
    const matches=showAll||checkedCats.includes(c.dataset.cat);
    c.style.display=matches?'':'none';
    if(matches)count++;
  });
  const label = document.getElementById('count-label');
  if(label) label.textContent=`Показано ${count} позиций`;
  setTimeout(()=>cards.forEach(c=>{if(c.style.display!=='none')c.classList.add('shown')}),50);
}

// Search
function handleSearch(q){
  if(!q) {
    cards.forEach(c=>c.style.display='');
    return;
  }
  const v=q.toLowerCase();
  let count=0;
  cards.forEach(c=>{
    const name=c.querySelector('.pcard-name').textContent.toLowerCase();
    const cat=c.querySelector('.pcard-cat').textContent.toLowerCase();
    const matches=name.includes(v)||cat.includes(v)||v==='';
    c.style.display=matches?'':'none';
    if(matches)count++;
  });
  const label = document.getElementById('count-label');
  if(label) label.textContent=`Найдено: ${count}`;
}

// Sort
function handleSort(val){
  const grid=document.getElementById('prod-grid');
  if(!grid) return;
  const arr=[...cards].filter(c=>c.style.display!=='none');
  if(val==='name'){arr.sort((a,b)=>a.querySelector('.pcard-name').textContent.localeCompare(b.querySelector('.pcard-name').textContent));}
  else if(val==='stock'){arr.sort((a,b)=>{const as=a.querySelector('.badge-green')?0:1,bs=b.querySelector('.badge-green')?0:1;return as-bs;});}
  arr.forEach(c=>grid.appendChild(c));
}

// View toggle
function setView(v){
  const grid=document.getElementById('prod-grid');
  if(!grid) return;
  const gbtn = document.getElementById('grid-btn');
  const lbtn = document.getElementById('list-btn');
  if(gbtn) gbtn.classList.toggle('active',v==='grid');
  if(lbtn) lbtn.classList.toggle('active',v==='list');
  grid.classList.toggle('list-mode',v==='list');
}

// Active filter chips
function removeChip(el){if(el && el.parentElement) el.parentElement.remove();}

// Reset filters
function resetFilters(){
  document.querySelectorAll('.filter-opt').forEach(o=>o.classList.remove('checked'));
  const allOpt = document.querySelector('.filter-opt[data-cat="all"]');
  if(allOpt) allOpt.classList.add('checked');
  const chips = document.getElementById('active-chips');
  if(chips) chips.innerHTML='';
  cards.forEach(c=>c.style.display='');
  const label = document.getElementById('count-label');
  if(label) label.textContent=`Показано ${cards.length} позиций`;
}

// Modal data
const modalData=[
  {cat:'Муфты',title:'Муфта электросварная DN 250',desc:'Стыковая соединительная муфта из полиэтилена PE 100 со встроенным нагревательным элементом для создания диффузионного сварного соединения. Немецкое производство Georg Fischer AG. Полный пакет сертификатов ISO, EN, DVGW.',dn:'250 мм',l:'360 мм',stock:'В наличии',stockColor:'var(--green)'},
  {cat:'Отводы',title:'Отвод 90° DN 200',desc:'Угловой отвод из PE 100 для изменения направления трубопровода на 90°. Оптимизированная внутренняя геометрия минимизирует гидравлические потери давления. Австрийское производство.',dn:'200 мм',l:'R=200 мм',stock:'В наличии',stockColor:'var(--green)'},
  {cat:'Тройники',title:'Тройник T DN 315',desc:'Равнопроходной тройник для создания ответвлений в напорных трубопроводах из ПЭ труб. Симметричная конструкция обеспечивает равномерное распределение потоков. Германия.',dn:'315 мм',l:'600 мм',stock:'Под заказ (3 нед.)',stockColor:'var(--amber)'},
  {cat:'Редукции',title:'Редукция DN 250/160',desc:'Концентрическая переходная редукция для соединения труб разных диаметров. Плавное сужение без образования зон турбулентности. Производство Италия.',dn:'250→160 мм',l:'240 мм',stock:'В наличии',stockColor:'var(--green)'},
  {cat:'Седёлки',title:'Седёлка DN 250 × 110',desc:'Электросварная седёлка для врезки ответвления в действующий ПЭ-трубопровод без его остановки и снятия давления. Интегрированный нагревательный элемент.',dn:'DN 250 × DN 110',l:'—',stock:'Под заказ (4 нед.)',stockColor:'var(--amber)'},
  {cat:'Заглушки',title:'Заглушка торцевая DN 250',desc:'Электросварная торцевая заглушка из PE 100 для постоянного или временного перекрытия концов ПЭ-трубопровода. Применяется при консервации и ремонте систем.',dn:'250 мм',l:'80 мм',stock:'В наличии',stockColor:'var(--green)'},
];
function openModal(i){
  const d=modalData[i];
  if(!d) return;
  const o=document.getElementById('modal-overlay'),m=document.getElementById('modal');
  if(!o || !m) return;
  
  const mcat = document.getElementById('modal-cat');
  const mtitle = document.getElementById('modal-title');
  const mdesc = document.getElementById('modal-desc');
  const mdn = document.getElementById('mt-dn');
  const ml = document.getElementById('mt-l');
  const mstock = document.getElementById('mt-stock');
  
  if(mcat) mcat.textContent=d.cat;
  if(mtitle) mtitle.textContent=d.title;
  if(mdesc) mdesc.textContent=d.desc;
  if(mdn) mdn.textContent=d.dn;
  if(ml) ml.textContent=d.l;
  if(mstock) {
    mstock.textContent=d.stock;
    mstock.style.color=d.stockColor;
  }
  
  // Copy the card's SVG into modal image
  const card=document.querySelectorAll('.pcard')[i];
  if(card){
    const svg=card.querySelector('svg');
    const mimg = document.getElementById('modal-img');
    if(mimg) mimg.innerHTML=svg?svg.outerHTML:'';
  }
  o.classList.add('open');m.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  const o = document.getElementById('modal-overlay');
  const m = document.getElementById('modal');
  if(o) o.classList.remove('open');
  if(m) m.classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// Pagination
document.querySelectorAll('.page-btn:not(.arrow)').forEach(b=>{
  b.addEventListener('click',function(){
    document.querySelectorAll('.page-btn:not(.arrow)').forEach(x=>x.classList.remove('active'));
    this.classList.add('active');
  });
});

// Reveal on scroll
const revEls=document.querySelectorAll('.reveal');
if(revEls.length > 0) {
  const ro=new IntersectionObserver(ents=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target);}});},{threshold:.12});
  revEls.forEach(el=>ro.observe(el));
}

// Mobile sidebar toggle
function toggleSidebar(){
  const s=document.getElementById('sidebar'),o=document.getElementById('sidebar-overlay');
  if(s && o){
    s.classList.toggle('open');
    o.classList.toggle('open');
    document.body.style.overflow=s.classList.contains('open')?'hidden':'';
  }
}
