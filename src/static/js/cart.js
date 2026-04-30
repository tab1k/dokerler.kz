/**
 * Dökerler Smart Cart System
 * Persistent, robust, and beautiful.
 */

class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('dokerler_cart')) || [];
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  bindEvents() {
    // Global listener for Add to Cart buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-cart]');
      if (btn) {
        e.preventDefault();
        const product = {
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: parseFloat(btn.dataset.price) || 0,
          image: btn.dataset.image || '',
          useModel: btn.dataset.useModel === '1',
          qty: 1
        };
        this.addItem(product);
        this.open();
      }
    });

    // Close buttons
    const closeBtn = document.getElementById('cart-close');
    const overlay = document.getElementById('cart-overlay');
    if (closeBtn) closeBtn.onclick = () => this.close();
    if (overlay) overlay.onclick = () => this.close();

    // Trigger
    const trigger = document.getElementById('cart-trigger');
    if (trigger) trigger.onclick = () => this.open();

    // Order button
    const orderBtn = document.getElementById('cart-order-btn');
    if (orderBtn) {
      orderBtn.onclick = () => {
        this.close();
        if (typeof openKpModal === 'function') {
          // Pre-fill comment with cart items
          const commentArea = document.getElementById('kp-comment');
          if (commentArea) {
            const list = this.items.map(i => `- ${i.name} (x${i.qty})`).join('\n');
            commentArea.value = `Заказ из корзины:\n${list}`;
          }
          openKpModal();
        }
      };
    }
  }

  addItem(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push(product);
    }
    this.save();
    this.render();
    this.animateBadge();
  }

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.render();
  }

  updateQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) this.removeItem(id);
      else {
        this.save();
        this.render();
      }
    }
  }

  save() {
    localStorage.setItem('dokerler_cart', JSON.stringify(this.items));
  }

  open() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  animateBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.classList.remove('pulse');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('pulse');
    }
  }

  render() {
    const container = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('cart-total');
    
    if (!container) return;

    // Update Badge
    const count = this.items.reduce((sum, i) => sum + i.qty, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update Total
    const total = this.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    if (totalEl) {
      totalEl.textContent = new Intl.NumberFormat('ru-RU').format(total) + ' ₸';
    }

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.2; margin-bottom: 16px;">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>Ваша корзина пуста</p>
          <a href="/catalog/" class="btn-ghost" style="margin-top: 12px;">Перейти в каталог</a>
        </div>
      `;
      return;
    }

    container.innerHTML = this.items.map(item => {
      const showModel = item.useModel || (item.name && item.name.toLowerCase().includes('муфта'));
      return `
      <div class="cart-item">
        <div class="cart-item-img">
          ${showModel ? `
            <model-viewer 
              src="/static/glb/mufta.glb" 
              style="width:100%; height:100%;" 
              auto-rotate 
              interaction-prompt="none" 
              shadow-intensity="0.5"
              exposure="0.8"
            ></model-viewer>
          ` : (item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div class="cart-item-placeholder"></div>`)}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${new Intl.NumberFormat('ru-RU').format(item.price)} ₸</div>
          <div class="cart-item-ctrl">
            <div class="cart-qty-btn" onclick="window.dokerlerCart.updateQty('${item.id}', -1)">-</div>
            <span class="cart-qty-val">${item.qty}</span>
            <div class="cart-qty-btn" onclick="window.dokerlerCart.updateQty('${item.id}', 1)">+</div>
            <div class="cart-item-remove" onclick="window.dokerlerCart.removeItem('${item.id}')">Удалить</div>
          </div>
        </div>
      </div>
    `}).join('');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.dokerlerCart = new Cart();
});
