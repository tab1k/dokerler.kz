// Cursor - Desktop only
if(!window.matchMedia('(max-width:1024px)').matches){
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
}

// Show cards with stagger
const cards=[...document.querySelectorAll('.pcard')];
cards.forEach((c,i)=>{setTimeout(()=>c.classList.add('shown'),100+i*60)});
const grid=document.getElementById('prod-grid');
const searchInput=document.getElementById('global-search');
const sortDropdown = document.getElementById('sort-dropdown');
const sortDropdownBtn = document.getElementById('sort-dropdown-btn');
const sortCurrentLabel = document.getElementById('sort-current-label');
const sortItems = document.querySelectorAll('.cat-sort-item');
const countLabel=document.getElementById('count-label');
const filterBadge=document.getElementById('filter-badge');
const paginationWrap=document.getElementById('cat-pagination');
const paginationList=document.getElementById('cat-page-list');
const prevPageBtn=document.getElementById('cat-page-prev');
const nextPageBtn=document.getElementById('cat-page-next');
const desktopResetBtn=document.getElementById('filters-reset-desktop');
const mobileResetBtn=document.getElementById('filters-reset-mobile');
const mobileApplyBtn=document.getElementById('filters-apply-mobile');
const quickChips=[...document.querySelectorAll('.cat-chip')];
const allFilterOptions=[...document.querySelectorAll('.filter-opt')];
const catFilterOptions=[...document.querySelectorAll('#cat-filters .filter-opt[data-cat]')];
const dnFilterOptions=[...document.querySelectorAll('.filter-opt[data-dn]')];
const sdrFilterOptions=[...document.querySelectorAll('.filter-opt[data-sdr]')];
const stockFilterOptions=[...document.querySelectorAll('.filter-opt[data-stock]')];
const defaultCheckedFilters=new Set(allFilterOptions.filter(opt=>opt.classList.contains('checked')));
const cardOrder=new Map(cards.map((card,index)=>[card,index]));
let searchTerm=searchInput ? searchInput.value.trim().toLowerCase() : '';
let sortMode = 'default';
if (sortDropdown) {
  const activeItem = sortDropdown.querySelector('.cat-sort-item.active');
  if (activeItem) sortMode = activeItem.dataset.value;
}
let currentPage=1;
let totalPages=1;

// Filter category (hero pills)
function filterCategory(cat,el){
  const targetCat=cat||'all';
  catFilterOptions.forEach(opt=>{
    if(targetCat==='all') opt.classList.toggle('checked',opt.dataset.cat==='all');
    else opt.classList.toggle('checked',opt.dataset.cat===targetCat);
  });
  filterCards({resetPage:true});
}

// Sidebar filter toggle
function toggleFilter(el,group){
  if(el) el.classList.toggle('checked');
  filterCards({resetPage:true});
}

function getSelectedCategories(){
  const selected=catFilterOptions
    .filter(opt=>opt.classList.contains('checked'))
    .map(opt=>opt.dataset.cat)
    .filter(Boolean);
  const selectedNoAll=selected.filter(cat=>cat!=='all');
  const showAll=selected.includes('all')||selectedNoAll.length===0;
  return {selectedNoAll,showAll};
}

function syncQuickChips(selectedNoAll,showAll){
  quickChips.forEach(chip=>{
    const chipCat=chip.dataset.cat;
    const active=showAll?chipCat==='all':selectedNoAll.includes(chipCat);
    chip.classList.toggle('active',active);
  });
}

function getCardDiameter(card){
  const fromData=Number.parseInt(card.dataset.dn||'',10);
  if(Number.isFinite(fromData)) return fromData;
  const nameEl=card.querySelector('.pcard-name,.pcard-title');
  const nameText=nameEl?nameEl.textContent:'';
  const match=nameText.match(/(\d+)\s*мм/i);
  return match?Number.parseInt(match[1],10):0;
}

function getSelectedValues(options,key){
  return options
    .filter(opt=>opt.classList.contains('checked'))
    .map(opt=>opt.dataset[key])
    .filter(Boolean);
}

function getSelectedDnRanges(){
  return getSelectedValues(dnFilterOptions,'dn')
    .map(range=>{
      const [min,max]=(range||'').split('-').map(value=>Number.parseInt(value,10));
      return {min,max};
    })
    .filter(range=>Number.isFinite(range.min)&&Number.isFinite(range.max));
}

function matchesDiameterRange(diameter,ranges){
  if(!ranges.length) return true;
  return ranges.some(range=>diameter>=range.min&&diameter<=range.max);
}

function updateFilterBadge(){
  if(!filterBadge) return;
  const activeCount=allFilterOptions.filter(opt=>{
    if(opt.dataset.cat==='all') return false;
    return opt.classList.contains('checked');
  }).length;
  filterBadge.textContent=String(activeCount);
  filterBadge.style.display=activeCount>0?'':'none';
}

function getItemsPerPage(){
  return window.matchMedia('(max-width: 1024px)').matches?4:6;
}

function buildPageModel(page,total){
  if(total<=7) return Array.from({length:total},(_,i)=>i+1);
  if(page<=3) return [1,2,3,4,'...',total];
  if(page>=total-2) return [1,'...',total-3,total-2,total-1,total];
  return [1,'...',page-1,page,page+1,'...',total];
}

function goToPage(page){
  const safePage=Math.max(1,Math.min(page,totalPages));
  if(safePage===currentPage) return;
  currentPage=safePage;
  filterCards();
}

function renderPagination(){
  if(!paginationWrap||!paginationList||!prevPageBtn||!nextPageBtn) return;
  paginationList.innerHTML='';
  const model=buildPageModel(currentPage,totalPages);
  model.forEach(item=>{
    const btn=document.createElement('button');
    if(item==='...'){
      btn.type='button';
      btn.className='cat-page-btn dots';
      btn.textContent='...';
      btn.disabled=true;
    }else{
      btn.type='button';
      btn.className=`cat-page-btn${item===currentPage?' active':''}`;
      btn.textContent=String(item);
      btn.addEventListener('click',()=>goToPage(item));
    }
    paginationList.appendChild(btn);
  });
  prevPageBtn.disabled=currentPage<=1;
  nextPageBtn.disabled=currentPage>=totalPages;
}

function filterCards(options={}){
  if(!cards.length){
    if(countLabel) countLabel.textContent='Показано 0 позиций';
    if(paginationWrap) paginationWrap.classList.add('hidden');
    updateFilterBadge();
    return;
  }
  if(options.resetPage) currentPage=1;
  const {selectedNoAll,showAll}=getSelectedCategories();
  const selectedDnRanges=getSelectedDnRanges();
  const selectedSdrs=getSelectedValues(sdrFilterOptions,'sdr');
  const selectedStocks=getSelectedValues(stockFilterOptions,'stock');
  syncQuickChips(selectedNoAll,showAll);

  const visibleCards=cards.filter(card=>{
    const category=(card.dataset.cat||'').toLowerCase();
    const categoryMatch=showAll||selectedNoAll.includes(category);
    if(!categoryMatch) return false;

    if(!matchesDiameterRange(getCardDiameter(card),selectedDnRanges)) return false;
    if(selectedSdrs.length&&!selectedSdrs.includes(card.dataset.sdr||'')) return false;
    if(selectedStocks.length&&!selectedStocks.includes(card.dataset.stock||'')) return false;

    if(!searchTerm) return true;
    const name=(card.querySelector('.pcard-name,.pcard-title')?.textContent||'').toLowerCase();
    const cat=(card.querySelector('.pcard-cat')?.textContent||'').toLowerCase();
    const sku=(card.querySelector('.pcard-sku')?.textContent||'').toLowerCase();
    const searchData=(card.dataset.search||'').toLowerCase();
    return name.includes(searchTerm)||cat.includes(searchTerm)||sku.includes(searchTerm)||searchData.includes(searchTerm);
  });

  const sortedCards=[...cards];
  if(sortMode==='dn-asc'||sortMode==='dn-desc'){
    const dir=sortMode==='dn-asc'?1:-1;
    sortedCards.sort((a,b)=>(getCardDiameter(a)-getCardDiameter(b))*dir);
  }else if(sortMode==='popular'){
    sortedCards.sort((a,b)=>{
      const popularDiff=Number.parseInt(b.dataset.popular||'0',10)-Number.parseInt(a.dataset.popular||'0',10);
      return popularDiff||cardOrder.get(a)-cardOrder.get(b);
    });
  }else{
    sortedCards.sort((a,b)=>cardOrder.get(a)-cardOrder.get(b));
  }

  const visibleSet=new Set(visibleCards);
  const sortedVisibleCards=sortedCards.filter(card=>visibleSet.has(card));
  const itemsPerPage=getItemsPerPage();
  totalPages=Math.max(1,Math.ceil(sortedVisibleCards.length/itemsPerPage));
  currentPage=Math.min(currentPage,totalPages);
  const pageStart=(currentPage-1)*itemsPerPage;
  const pageEnd=pageStart+itemsPerPage;
  const pageSet=new Set(sortedVisibleCards.slice(pageStart,pageEnd));

  sortedCards.forEach(card=>{
    card.style.display=pageSet.has(card)?'':'none';
    if(grid) grid.appendChild(card);
  });

  const hasFilters=!showAll||searchTerm.length>0||selectedDnRanges.length>0||selectedSdrs.length>0||selectedStocks.length>0;
  if(countLabel) countLabel.textContent=`${hasFilters?'Найдено':'Показано'} ${sortedVisibleCards.length} позиций`;
  if(paginationWrap) paginationWrap.classList.toggle('hidden',sortedVisibleCards.length<=itemsPerPage);
  renderPagination();
  updateFilterBadge();
  setTimeout(()=>cards.forEach(c=>{if(c.style.display!=='none')c.classList.add('shown')}),50);
}

// Search
function handleSearch(q){
  searchTerm=(q||'').trim().toLowerCase();
  filterCards({resetPage:true});
}

// Sort
function handleSort(val){
  sortMode=val||'default';
  filterCards({resetPage:true});
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

function isMobileFiltersMode(){
  return window.matchMedia('(max-width: 1024px)').matches;
}

function setSidebarOpenState(isOpen){
  const sidebar=document.getElementById('sidebar');
  const overlay=document.getElementById('cat-sidebar-overlay')||document.getElementById('sidebar-overlay');
  const btn=document.getElementById('filter-btn');
  if(!sidebar||!overlay) return;
  sidebar.classList.toggle('open',isOpen);
  overlay.classList.toggle('open',isOpen);
  document.body.style.overflow=isOpen?'hidden':'';
  if(btn) btn.classList.toggle('active',isOpen);
}

function applyFilters(){
  if(isMobileFiltersMode()) setSidebarOpenState(false);
}

// Reset filters
function resetFilters(){
  allFilterOptions.forEach(opt=>opt.classList.toggle('checked',defaultCheckedFilters.has(opt)));
  if(searchInput) searchInput.value='';
  if(sortDropdown) {
    const defaultItem = [...sortItems].find(i => i.dataset.value === 'default');
    if (defaultItem) {
      sortItems.forEach(si => si.classList.toggle('active', si === defaultItem));
      if (sortCurrentLabel) sortCurrentLabel.textContent = defaultItem.textContent;
    }
  }
  searchTerm='';
  sortMode='default';
  filterCards({resetPage:true});
}

function clearFilters(closeAfter){
  resetFilters();
  if(closeAfter) applyFilters();
}

catFilterOptions.forEach(opt=>{
  opt.addEventListener('click',e=>{
    e.preventDefault();
    const clickedCat=opt.dataset.cat;
    if(clickedCat==='all'){
      catFilterOptions.forEach(catOpt=>catOpt.classList.toggle('checked',catOpt.dataset.cat==='all'));
    }else{
      opt.classList.toggle('checked');
      const allCatOpt=catFilterOptions.find(catOpt=>catOpt.dataset.cat==='all');
      if(allCatOpt) allCatOpt.classList.remove('checked');
      const hasSpecific=catFilterOptions.some(catOpt=>catOpt.dataset.cat!=='all'&&catOpt.classList.contains('checked'));
      if(!hasSpecific&&allCatOpt) allCatOpt.classList.add('checked');
    }
    filterCards({resetPage:true});
  });
});

quickChips.forEach(chip=>{
  chip.addEventListener('click',()=>{
    const clickedCat=chip.dataset.cat||'all';
    catFilterOptions.forEach(opt=>{
      if(clickedCat==='all') opt.classList.toggle('checked',opt.dataset.cat==='all');
      else opt.classList.toggle('checked',opt.dataset.cat===clickedCat);
    });
    filterCards({resetPage:true});
  });
});

allFilterOptions.forEach(opt=>{
  if(opt.dataset.cat) return;
  opt.addEventListener('click',e=>{
    e.preventDefault();
    opt.classList.toggle('checked');
    filterCards({resetPage:true});
  });
});

if(searchInput){
  searchInput.addEventListener('input',e=>handleSearch(e.target.value));
}

if (sortDropdownBtn) {
  sortDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle('active');
  });
}

sortItems.forEach(item => {
  item.addEventListener('click', () => {
    const val = item.dataset.value;
    sortItems.forEach(si => si.classList.toggle('active', si === item));
    if (sortCurrentLabel) sortCurrentLabel.textContent = item.textContent;
    sortDropdown.classList.remove('active');
    handleSort(val);
  });
});

document.addEventListener('click', () => {
  if (sortDropdown) sortDropdown.classList.remove('active');
});

if(prevPageBtn){
  prevPageBtn.addEventListener('click',()=>goToPage(currentPage-1));
}

if(nextPageBtn){
  nextPageBtn.addEventListener('click',()=>goToPage(currentPage+1));
}

if(desktopResetBtn){
  desktopResetBtn.addEventListener('click',()=>clearFilters(false));
}

if(mobileResetBtn){
  mobileResetBtn.addEventListener('click',()=>clearFilters(true));
}

if(mobileApplyBtn){
  mobileApplyBtn.addEventListener('click',applyFilters);
}

let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
    if(!isMobileFiltersMode()) setSidebarOpenState(false);
    filterCards();
  },120);
});

function applyInitialCategoryFromUrl(){
  const params=new URLSearchParams(window.location.search);
  const initialCategory=params.get('category');
  if(!initialCategory) return;
  const hasCategory=catFilterOptions.some(opt=>opt.dataset.cat===initialCategory);
  if(!hasCategory) return;
  catFilterOptions.forEach(opt=>{
    opt.classList.toggle('checked',opt.dataset.cat===initialCategory);
  });
}

applyInitialCategoryFromUrl();
filterCards({resetPage:true});

// Quick Filters Carousel Drag
const qf = document.getElementById('quick-filters');
if (qf) {
  let isDown = false;
  let startX;
  let scrollLeft;
  qf.addEventListener('mousedown', (e) => {
    isDown = true;
    qf.classList.add('active');
    startX = e.pageX - qf.offsetLeft;
    scrollLeft = qf.scrollLeft;
  });
  qf.addEventListener('mouseleave', () => { isDown = false; });
  qf.addEventListener('mouseup', () => { isDown = false; });
  qf.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - qf.offsetLeft;
    const walk = (x - startX) * 2;
    qf.scrollLeft = scrollLeft - walk;
  });
}

// Reveal on scroll
const revEls=document.querySelectorAll('.reveal');
if(revEls.length > 0) {
  const ro=new IntersectionObserver(ents=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target);}});},{threshold:.12});
  revEls.forEach(el=>ro.observe(el));
}

// Mobile sidebar toggle
function toggleSidebar(){
  const sidebar=document.getElementById('sidebar');
  if(!sidebar||!isMobileFiltersMode()) return;
  setSidebarOpenState(!sidebar.classList.contains('open'));
}

window.toggleSidebar=toggleSidebar;
window.applyFilters=applyFilters;
window.clearFilters=clearFilters;
