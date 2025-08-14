// Frontend logic: fetch menu from Flask, manage cart, totals, payment, UI behaviors.

let MENU = [];
let CART = []; // items: {id, name, price, gst, qty}
const GST_DECIMALS = 2;

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  fetchMenu();
  setupUI();
});

function initClock(){
  const el = document.getElementById('clock');
  function tick(){
    el.textContent = new Date().toLocaleString();
  }
  tick();
  setInterval(tick, 1000);
}

async function fetchMenu(){
  try {
    const res = await fetch('/menu');
    const data = await res.json();
    MENU = data.menu;
    renderCategories(data.categories);
    renderMenu('All');
  } catch (err) {
    console.error('Menu load failed', err);
  }
}

function renderCategories(categories){
  const bar = document.getElementById('categoryBar');
  bar.innerHTML = '';
  categories.forEach((c, idx) => {
    const btn = document.createElement('button');
    btn.textContent = c;
    btn.className = idx === 0 ? 'active' : '';
    btn.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(c);
    });
    bar.appendChild(btn);
  });
}

function renderMenu(category){
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';

  const items = MENU.filter(i => category === 'All' || i.category === category);
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="menu-head"><div>${item.name}</div><div style="color:var(--accent);">₹${item.price}</div></div>
      <div class="menu-desc">${item.desc}</div>
      <div class="menu-gst">GST ${item.gst}%</div>
      <div class="add-row">
        <div style="color:#777;font-size:13px">${item.category}</div>
        <button class="btn-add">+ Add</button>
      </div>
    `;
    card.querySelector('.btn-add').addEventListener('click', () => addToCart(item));
    grid.appendChild(card);
  });

  if(items.length === 0){
    grid.innerHTML = `<div style="padding:20px;color:#666">No items in this category</div>`;
  }
}

/* CART MANAGEMENT */

function addToCart(item){
  const found = CART.find(i => i.id === item.id);
  if(found) found.qty += 1;
  else CART.push({...item, qty: 1});
  renderCart();
}

function changeQty(itemId, delta){
  const idx = CART.findIndex(i => i.id === itemId);
  if(idx === -1) return;
  CART[idx].qty += delta;
  if(CART[idx].qty <= 0) CART.splice(idx,1);
  renderCart();
}

function removeItem(itemId){
  CART = CART.filter(i => i.id !== itemId);
  renderCart();
}

function renderCart(){
  const container = document.getElementById('billItems');
  container.innerHTML = '';
  if(CART.length === 0){
    container.classList.add('empty');
    container.innerHTML = 'No items in order';
  } else {
    container.classList.remove('empty');
    CART.forEach(it => {
      const row = document.createElement('div');
      row.className = 'bill-item';
      row.innerHTML = `
        <div>
          <div style="font-weight:700">${it.name}</div>
          <div style="font-size:12px;color:#777">₹${it.price} • GST ${it.gst}%</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="qty-controls">
            <button onclick="changeQty(${it.id}, -1)">-</button>
            <span style="min-width:22px;text-align:center">${it.qty}</span>
            <button onclick="changeQty(${it.id}, 1)">+</button>
          </div>
          <div style="min-width:70px;text-align:right">
            ₹${(it.price * it.qty).toFixed(2)}
            <div style="font-size:11px;color:#999">GST ₹${((it.price * it.qty * it.gst)/100).toFixed(GST_DECIMALS)}</div>
          </div>
          <button style="margin-left:6px;background:none;border:none;color:#d00;cursor:pointer" title="remove" onclick="removeItem(${it.id})">✕</button>
        </div>
      `;
      container.appendChild(row);
    });
  }
  updateTotals();
}

/* totals & payment */

function updateTotals(){
  const subtotal = CART.reduce((s,i) => s + i.price * i.qty, 0);
  const gstTotal = CART.reduce((s,i) => s + (i.price * i.qty * i.gst) / 100, 0);
  const grand = subtotal + gstTotal;
  document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('gstTotal').textContent = `₹${gstTotal.toFixed(2)}`;
  document.getElementById('grandTotal').textContent = `₹${grand.toFixed(2)}`;
}

/* UI wired events */
function setupUI(){
  // order type
  document.getElementById('btnDine').addEventListener('click', e => {
    toggleClassGroup('.type-btn', e.target);
  });
  document.getElementById('btnTake').addEventListener('click', e => {
    toggleClassGroup('.type-btn', e.target);
  });

  // payment methods
  document.querySelectorAll('.pm-btn').forEach(btn => {
    btn.addEventListener('click', e => toggleClassGroup('.pm-btn', btn));
  });

  // clear
  document.getElementById('btnClear').addEventListener('click', () => {
    CART = [];
    renderCart();
    document.getElementById('thankBox').classList.add('hidden');
  });

  // process payment
  document.getElementById('btnPay').addEventListener('click', processPayment);
}

function toggleClassGroup(selector, activeEl){
  document.querySelectorAll(selector).forEach(b => b.classList.remove('active'));
  activeEl.classList.add('active');
}

async function processPayment(){
  if(CART.length === 0){
    alert('Cart is empty. Add items before processing payment.');
    return;
  }
  const orderType = document.querySelector('.type-btn.active')?.getAttribute('data-type') || 'Dine-In';
  const paymentMethod = document.querySelector('.pm-btn.active')?.getAttribute('data-method') || 'UPI';
  const customerName = document.getElementById('customerName').value.trim();
  const tableNumber = document.getElementById('tableNumber').value.trim();

  const subtotal = CART.reduce((s,i) => s + i.price * i.qty, 0);
  const gstTotal = CART.reduce((s,i) => s + (i.price * i.qty * i.gst) / 100, 0);
  const total = subtotal + gstTotal;

  const payload = {
    orderType, paymentMethod, customerName, tableNumber,
    items: CART.map(i => ({id:i.id, name:i.name, price:i.price, gst:i.gst, qty:i.qty})),
    subtotal, gstTotal, total
  };

  try {
    const res = await fetch('/process_payment', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(data && data.success){
      // show thank you and clear cart
      document.getElementById('thankBox').classList.remove('hidden');
      // small animation: hide after 2.5s and clear
      setTimeout(() => {
        CART = [];
        renderCart();
        document.getElementById('thankBox').classList.add('hidden');
      }, 2500);
    } else {
      alert('Payment failed. Try again.');
    }
  } catch(err){
    console.error(err);
    alert('Network error. Could not process payment.');
  }
}
