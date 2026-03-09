const fs = require('fs');

function extractBodyRaw(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (!match) return '';
        let bodyText = match[1];
        bodyText = bodyText.replace(/<nav[^>]*bottom-0.*?>[\s\S]*?<\/nav>/ig, '');
        bodyText = bodyText.replace(/<nav[^>]*bg-white[^>]*px-6[^>]*py-3.*?>[\s\S]*?<\/nav>/ig, '');
        bodyText = bodyText.replace(/<nav class="flex gap-2 border-t.*?<\/nav>/igs, '');
        return bodyText;
    } catch (e) { return ''; }
}

const clientApp = `
import { Auth, Orders } from '../shared/api.js';
import { initGeo, getCurrentPosition } from '../shared/geo.js';

const appContent = document.getElementById('app-content');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
let socket, user, currentOrder, map, myMarker, geoWatchId;

function saveUser(u) { user = u; localStorage.setItem('movvi_client', JSON.stringify(u)); }
function loadUser() { try { return JSON.parse(localStorage.getItem('movvi_client')); } catch { return null; } }
function nav(fn, data) { closeSidebar(); appContent.innerHTML = ''; const el = fn(data); appContent.appendChild(el); el.classList.add('fade-in'); }

function buildSidebar() {
  sidebar.innerHTML = \\\`<div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-[#222]">
      <div class="flex items-center gap-4">
        <div class="h-10 w-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center border border-primary/50"><span class="material-symbols-outlined text-lg">person</span></div>
        <div class="flex-1 min-w-0"><h2 class="text-slate-900 dark:text-white text-sm font-bold truncate tracking-wide">\\\${user?.name?.split(' ')[0]?.toUpperCase() || 'CLIENTE'}</h2><p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">\\\${user?.email || ''}</p></div>
      </div>
      <button class="sidebar-close w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"><span class="material-symbols-outlined text-base">close</span></button>
    </div>
    <nav class="flex-1 overflow-y-auto pt-4 px-2">
      <div class="flex flex-col gap-1.5">
        <a data-nav="home" class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"><span class="material-symbols-outlined group-hover:text-primary transition-colors">home</span><span class="text-sm font-semibold flex-1 tracking-wide">Início</span></a>
        <a data-nav="history" class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"><span class="material-symbols-outlined group-hover:text-primary transition-colors">history</span><span class="text-sm font-semibold flex-1 tracking-wide">Meus Serviços</span></a>
        <a data-nav="profile" class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"><span class="material-symbols-outlined group-hover:text-primary transition-colors">badge</span><span class="text-sm font-semibold flex-1 tracking-wide">Perfil</span></a>
        <a data-nav="vehicle" class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"><span class="material-symbols-outlined group-hover:text-primary transition-colors">directions_car</span><span class="text-sm font-semibold flex-1 tracking-wide">Meu Veículo</span></a>
      </div>
    </nav>
    <div class="px-5 pb-8 pt-4 border-t border-slate-200 dark:border-[#222]">
      <a data-nav="logout" class="flex items-center gap-3 text-red-500 cursor-pointer hover:text-red-400 transition-colors"><span class="material-symbols-outlined text-base">logout</span><span class="text-sm font-bold tracking-widest uppercase">Sair do App</span></a>
    </div>\\\`;
  sidebar.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = () => {
      const t = a.dataset.nav;
      if (t === 'home') nav(homeView);
      else if (t === 'history') nav(historyView);
      else if (t === 'profile') nav(homeView);
      else if (t === 'vehicle') nav(homeView);
      else if (t === 'logout') { localStorage.removeItem('movvi_client'); socket?.disconnect(); nav(loginView); }
    };
  });
  sidebar.querySelector('.sidebar-close').onclick = closeSidebar;
}

function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }
sidebarOverlay.onclick = closeSidebar;
function bindMenu(el) { 
  el.querySelectorAll('.material-symbols-outlined').forEach(icon => {
    if (icon.textContent.includes('notifications') || icon.textContent.includes('menu')) {
      const btn = icon.closest('button');
      if(btn) {
        btn.onclick = openSidebar;
        icon.textContent = 'menu'; // always replace with menu
      }
    }
  });
}

function connectSocket() {
  socket = io();
  socket.on('connect', () => socket.emit('register:client', user.id));
  socket.on('order:searching', ({ message }) => { const el = document.getElementById('search-status'); if (el) el.textContent = message; });
  socket.on('order:accepted', (d) => { currentOrder = { ...currentOrder, ...d, status: 'accepted' }; nav(trackingView, currentOrder); });
  socket.on('order:status', ({ orderId, status }) => { if (currentOrder?.id === orderId) { currentOrder.status = status; if (status === 'completed') nav(ratingView, currentOrder); } });
  socket.on('driver:location', ({ latitude, longitude }) => { if (myMarker) myMarker.setLatLng([latitude, longitude]); if (map) map.panTo([latitude, longitude]); });
  geoWatchId = initGeo(({ latitude, longitude }) => { socket.emit('client:location', { clientId: user.id, latitude, longitude }); });
}

function wrapView(htmlStr) {
  const d = document.createElement('div'); d.className = 'view active flex-1 bg-background-light dark:bg-background-dark';
  d.innerHTML = htmlStr;
  bindMenu(d);
  return d;
}

function loginView() {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/bem_vindo_ao_movvi_reboque/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const form = d.querySelector('form');
  if(!form) return d;
  const errDiv = document.createElement('div'); errDiv.className = "text-red-500 text-xs mt-2 hidden"; form.appendChild(errDiv);
  form.onsubmit = async (e) => {
    e.preventDefault();
    try { 
      const email = d.querySelector('input[type="email"]')?.value;
      const pass = d.querySelector('input[type="password"]')?.value;
      const { user: u } = await Auth.loginClient(email, pass || '123456'); saveUser(u); connectSocket(); buildSidebar(); nav(homeView); 
    }
    catch (err) { errDiv.textContent = err.message; errDiv.classList.remove('hidden'); }
  };
  d.querySelectorAll('a').forEach(a=>{if(a.textContent.includes('Criar conta')) a.onclick=(e)=>{e.preventDefault(); nav(registerView);};});
  return d;
}

function registerView() {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/cadastro_de_cliente_onix_real/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const form = d.querySelector('form');
  if(!form) return d;
  const errDiv = document.createElement('div'); errDiv.className = "text-red-500 text-xs mt-2 hidden"; form.appendChild(errDiv);
  form.onsubmit = async (e) => {
    e.preventDefault();
    try { 
      const inputs = d.querySelectorAll('input');
      const u = await Auth.registerClient({ name: inputs[0].value, email: inputs[4].value, phone: inputs[3].value, vehicleModel: inputs[6].value, password: inputs[4].value + '123' }); 
      saveUser(u); connectSocket(); buildSidebar(); nav(homeView); 
    }
    catch (err) { errDiv.textContent = err.message; errDiv.classList.remove('hidden'); }
  };
  return d;
}

function homeView() {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/escolha_o_servi_o_1/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  
  // Set User Info
  const texts = d.querySelectorAll('p, h1');
  texts.forEach(t => {
      if(t.textContent.includes('Olá,')) t.textContent = 'Olá, ' + (user?.name?.split(' ')[0] || 'Cliente') + '!';
  });

  // Attach buttons
  d.querySelectorAll('button').forEach(b => {
    const title = b.querySelector('h3')?.textContent || '';
    if(!title) return;
    b.onclick = () => {
      let type = 'reboque';
      if(title.includes('Seca')) type = 'pane_seca';
      if(title.includes('Chupeta')) type = 'chupeta';
      if(title.includes('Pneu')) type = 'pneu';
      nav(serviceDetailView, { type, name: title });
    };
  });
  return d;
}

function serviceDetailView({ type, name }) {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/detalhes_do_servi_o/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  setTimeout(() => {
    // Map replacement
    const el = d.querySelector('.bg-slate-800'); 
    if (el) {
      el.id = "cmap";
      const isDark = document.documentElement.className.includes('dark');
      map = L.map('cmap', { zoomControl: false, attributionControl: false }).setView([-15.78, -47.92], 4);
      L.tileLayer(isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      getCurrentPosition().then(p => {
        map.flyTo([p.latitude, p.longitude], 18, { duration: 1.5 });
        L.marker([p.latitude, p.longitude], {
          icon: L.divIcon({ className: '', html: '<div style="width:20px;height:20px;background:#f2d00d;border:3px solid #000;border-radius:50%"></div>', iconSize: [20, 20], iconAnchor: [10, 10] })
        }).addTo(map);
      }).catch(()=>{});
    }
  }, 200);

  const reqBtn = Array.from(d.querySelectorAll('button')).find(b => b.textContent.includes('Solicitar'));
  if(reqBtn) reqBtn.onclick = () => nav(summaryView, { type, name });
  return d;
}

function summaryView(data) {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/resumo_e_valor_do_servi_o/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const btn = Array.from(d.querySelectorAll('button')).find(b => b.textContent.includes('Confirmar'));
  if(btn) btn.onclick = () => nav(paymentView, data);
  return d;
}

function paymentView(data) {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/sele_o_de_pagamento_e_aviso_de_taxa/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const btn = Array.from(d.querySelectorAll('button')).find(b => b.textContent.includes('Pagar'));
  if(btn) btn.onclick = async () => {
    try {
      const o = await Orders.create({ clientId: user.id, clientName: user.name, serviceType: data.type, serviceName: data.name, pickupAddress: 'Minha Localização', pickupLat: -23.55, pickupLon: -46.63, destinationAddress: 'Oficina Movvi', vehicleModel: user.vehicleModel || 'Veículo' });
      currentOrder = o; nav(searchingView, o);
    } catch(e) { alert(e.message); }
  };
  return d;
}

function searchingView(order) {
  // Use a simple searching view inside styled wrapper
  const d = wrapView(\`<div class="flex-1 flex flex-col items-center justify-center p-8 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white text-center">
    <div class="size-24 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6"></div>
    <h2 class="text-2xl font-bold mb-2">Buscando Parceiro...</h2>
    <p id="search-status" class="text-slate-500">Notificando motoristas próximos</p>
    <button id="cancel" class="mt-8 text-red-500 font-bold border border-red-500/20 px-8 py-3 rounded-xl">Cancelar Pedido</button>
  </div>\`);
  d.querySelector('#cancel').onclick = async () => { try { await Orders.updateStatus(order.id, 'cancelled'); currentOrder = null; nav(homeView); } catch(e){} };
  return d;
}

function trackingView(data) {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/acompanhamento_do_motorista_em_tempo_real/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  setTimeout(() => {
    const el = d.querySelector('.bg-slate-800'); // Map container in mockup
    if (el) {
      el.id = 'tmap';
      const isDark = document.documentElement.className.includes('dark');
      map = L.map('tmap', { zoomControl: false, attributionControl: false }).setView([data.driverLat || -23.55, data.driverLon || -46.63], 15);
      L.tileLayer(isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      myMarker = L.marker([data.driverLat || -23.55, data.driverLon || -46.63], { icon: L.divIcon({ className: '', html: '<div style="width:20px;height:20px;background:#f2d00d;border:2px solid #000;border-radius:4px"></div>', iconSize: [20, 20] }) }).addTo(map);
    }
  }, 200);
  return d;
}

function ratingView(data) {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-cliente/avalia_o_do_servi_o_e_recibo/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const stars = d.querySelectorAll('.material-symbols-outlined');
  let rating = 0;
  stars.forEach((s, idx) => {
    if(s.textContent === 'star') {
      s.parentElement.onclick = () => {
        rating = idx;
        try { Orders.rate(data.id, rating, 'client'); } catch{}
      };
    }
  });
  const btn = Array.from(d.querySelectorAll('button')).find(b => b.textContent.includes('Enviar') || b.textContent.includes('Concluir'));
  if(btn) btn.onclick = () => { currentOrder = null; nav(homeView); };
  return d;
}

function historyView() {
  const d = wrapView(\`<header class="flex items-center justify-between p-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-200 dark:border-white/10"><button class="btn-menu p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button><h2 class="font-bold">Histórico</h2><div class="size-10"></div></header>
  <div class="p-6 flex-1 overflow-y-auto"><div id="hl" class="flex flex-col gap-3">Carregando...</div></div>\`);
  bindMenu(d);
  (async () => {
    const o = await Orders.list({ clientId: user.id });
    d.querySelector('#hl').innerHTML = o.map(i => \\\`<div class="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl"><p class="font-bold text-slate-900 dark:text-white">\\\${i.serviceName}</p><p class="text-xs text-slate-500 dark:text-slate-400">\\\${new Date(i.createdAt).toLocaleDateString()} - \\\${i.status}</p></div>\\\`).join('');
  })();
  return d;
}

const saved = loadUser();
if (saved) { user = saved; connectSocket(); buildSidebar(); nav(homeView); }
else { nav(loginView); }
`;

// ================= DRIVER APP =================
const driverApp = `
import { Auth, Orders } from '../shared/api.js';
import { initGeo, getCurrentPosition } from '../shared/geo.js';

const appContent = document.getElementById('app-content');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
let socket, user, activeOrder, map, myMarker, geoWatchId, incomingTimer;

function saveUser(u) { user = u; localStorage.setItem('movvi_driver', JSON.stringify(u)); }
function loadUser() { try { return JSON.parse(localStorage.getItem('movvi_driver')); } catch { return null; } }
function nav(fn, data) { closeSidebar(); appContent.innerHTML = ''; const el = fn(data); appContent.appendChild(el); el.classList.add('fade-in'); }

function buildSidebar() {
  sidebar.innerHTML = \\\`<div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-[#222]">
      <div class="flex items-center gap-4">
        <div class="h-10 w-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center border border-primary/50"><span class="material-symbols-outlined text-lg">person</span></div>
        <div class="flex-1 min-w-0"><h2 class="text-slate-900 dark:text-white text-sm font-bold truncate tracking-wide">\\\${user?.name?.split(' ')[0]?.toUpperCase() || 'MOTORISTA'}</h2><p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Parceiro \\\${user?.plate || ''}</p></div>
      </div>
      <button class="sidebar-close w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"><span class="material-symbols-outlined text-base">close</span></button>
    </div>
    <nav class="flex-1 overflow-y-auto pt-4 px-2">
      <div class="flex flex-col gap-1.5">
        <a data-nav="dash" class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"><span class="material-symbols-outlined group-hover:text-primary transition-colors">home</span><span class="text-sm font-semibold flex-1 tracking-wide">Início</span></a>
        <a data-nav="earn" class="flex items-center gap-3.5 px-3 py-3 rounded-lg text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"><span class="material-symbols-outlined group-hover:text-primary transition-colors">account_balance_wallet</span><span class="text-sm font-semibold flex-1 tracking-wide">Meus Ganhos</span></a>
      </div>
    </nav>
    <div class="px-5 pb-8 pt-4 border-t border-slate-200 dark:border-[#222]">
      <a data-nav="logout" class="flex items-center gap-3 text-red-500 cursor-pointer hover:text-red-400 transition-colors"><span class="material-symbols-outlined text-base">logout</span><span class="text-sm font-bold tracking-widest uppercase">Sair do App</span></a>
    </div>\\\`;
  sidebar.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = () => {
      const t = a.dataset.nav;
      if (t === 'dash') nav(dashboardView);
      else if (t === 'earn') nav(earningsView);
      else if (t === 'logout') { socket?.emit('driver:offline', user.id); socket?.disconnect(); localStorage.removeItem('movvi_driver'); nav(loginView); }
    };
  });
  sidebar.querySelector('.sidebar-close').onclick = closeSidebar;
}

function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }
sidebarOverlay.onclick = closeSidebar;
function bindMenu(el) { 
  el.querySelectorAll('.material-symbols-outlined').forEach(icon => {
    if (icon.textContent.includes('menu')) {
      const btn = icon.closest('button');
      if(btn) btn.onclick = openSidebar;
    }
  });
}

function connectSocket() {
  socket = io();
  socket.on('connect', () => socket.emit('register:driver', user.id));
  socket.on('order:incoming', (d) => nav(incomingView, d));
  socket.on('order:timeout', () => { clearInterval(incomingTimer); nav(dashboardView); });
  socket.on('order:status', ({ orderId, status }) => {
    if (activeOrder && (activeOrder.orderId === orderId || activeOrder.id === orderId)) {
      activeOrder.status = status;
      if (status === 'completed') nav(dashboardView);
      if (status === 'cancelled') { activeOrder = null; nav(dashboardView); }
    }
  });
  geoWatchId = initGeo(({ latitude, longitude }) => {
    socket.emit('driver:location', { driverId: user.id, latitude, longitude });
    if (myMarker) myMarker.setLatLng([latitude, longitude]);
    if (map) map.panTo([latitude, longitude]);
  });
}

function wrapView(htmlStr) {
  const d = document.createElement('div'); d.className = 'view active flex-1 bg-background-light dark:bg-background-dark';
  d.innerHTML = htmlStr;
  bindMenu(d);
  return d;
}

function loginView() {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-motorista-parceiro/login_do_motorista_parceiro/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const form = d.querySelector('form');
  if(!form) return d;
  const errDiv = document.createElement('div'); errDiv.className = "text-red-500 text-xs mt-2 hidden"; form.appendChild(errDiv);
  form.onsubmit = async (e) => {
    e.preventDefault();
    try { 
      const email = d.querySelector('input[type="email"]').value;
      const pass = d.querySelector('input[type="password"]')?.value;
      const { user: u } = await Auth.loginDriver(email, pass || '123456'); saveUser(u); connectSocket(); buildSidebar(); nav(dashboardView); 
    }
    catch (err) { errDiv.textContent = err.message; errDiv.classList.remove('hidden'); }
  };
  return d;
}

function dashboardView() {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-motorista-parceiro/driver_dashboard/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  
  const balanceRow = d.querySelector('h2.text-3xl'); 
  if(balanceRow) balanceRow.parentElement.parentElement.remove(); 
  
  const toggleBtn = Array.from(d.querySelectorAll('span')).find(s => s.textContent.includes('Online'))?.closest('.flex');
  if(toggleBtn) {
    toggleBtn.classList.add('cursor-pointer');
    toggleBtn.onclick = () => {
      user.online = !user.online;
      saveUser(user);
      socket.emit(user.online ? 'driver:online' : 'driver:offline', user.id);
      nav(dashboardView);
    };
    if (!user.online) {
      toggleBtn.querySelector('span:first-child').textContent = 'Offline';
      toggleBtn.querySelector('span:first-child').classList.replace('text-primary', 'text-slate-500');
    }
  }

  setTimeout(() => {
    const bgDiv = d.querySelector('.bg-background-dark\\\\/90') || d.querySelector('.z-0');
    if (bgDiv) {
      bgDiv.id = 'dmap';
      bgDiv.style.backgroundImage = 'none';
      bgDiv.innerHTML = ''; 
      const isDark = document.documentElement.className.includes('dark');
      map = L.map('dmap', { zoomControl: false, attributionControl: false }).setView([-15.78, -47.92], 4);
      L.tileLayer(isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      
      getCurrentPosition().then(p => {
        map.flyTo([p.latitude, p.longitude], 18, { duration: 1.5 });
        myMarker = L.marker([p.latitude, p.longitude], {
          icon: L.divIcon({ className: '', html: '<div style="width:24px;height:24px;background:#f2d00d;border-radius:50%;border:4px solid #000;box-shadow:0 0 10px rgba(242,208,13,0.5)"></div>', iconSize: [24, 24], iconAnchor: [12, 12] })
        }).addTo(map);
      }).catch(()=>{});
    }
  }, 200);

  return d;
}

function incomingView(data) {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-motorista-parceiro/incoming_job_request/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const acceptBtn = Array.from(d.querySelectorAll('button')).find(b => b.textContent.includes('Aceitar'));
  const declineBtn = Array.from(d.querySelectorAll('button')).find(b => b.textContent.includes('Recusar'));
  
  if (acceptBtn) acceptBtn.onclick = () => { socket.emit('order:accept', { driverId: user.id, orderId: data.orderId }); activeOrder = data; nav(activeJobView, data); };
  if (declineBtn) declineBtn.onclick = () => { socket.emit('order:decline', { driverId: user.id, orderId: data.orderId }); nav(dashboardView); };
  return d;
}

function activeJobView(data) {
  const d = wrapView(\`<div class="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
    <div class="p-4 bg-background-dark/80"><button class="btn-menu text-primary"><span class="material-symbols-outlined">menu</span></button></div>
    <div id="amap" class="flex-1"></div>
    <div class="p-6 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-primary/20 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] mt-[-20px] relative z-10">
      <h3 class="font-bold text-lg mb-2">\\\${data.clientName || 'Cliente'}</h3>
      <p class="text-slate-500 mb-6">\\\${data.pickupAddress || 'Endereço Local'}</p>
      <button id="arrived" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg">Cheguei ao Local</button>
    </div>
  </div>\`);
  bindMenu(d);
  d.querySelector('#arrived').onclick = () => { 
    socket.emit('order:complete', { orderId: data.orderId }); 
    activeOrder = null;
    nav(dashboardView); 
  };
  setTimeout(() => {
    map = L.map('amap', { zoomControl: false, attributionControl: false }).setView([data.pickupLat || -23.55, data.pickupLon || -46.63], 15);
    const isDark = document.documentElement.className.includes('dark');
    L.tileLayer(isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
  }, 200);
  return d;
}

function earningsView() {
  const d = wrapView(\`${extractBodyRaw('telas-do-app-motorista-parceiro/ganhos_detalhados_do_motorista/code.html').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
  const goBack = d.querySelector('.btn-menu') || d.querySelector('button');
  if(goBack) goBack.onclick = () => nav(dashboardView);
  return d;
}

const saved = loadUser();
if (saved) { user = saved; connectSocket(); buildSidebar(); nav(dashboardView); }
else { nav(loginView); }
`;

fs.writeFileSync('src/client/main.js', clientApp);
fs.writeFileSync('src/driver/main.js', driverApp);
console.log("Success!");
